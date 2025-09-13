const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const inventory = require("../models/invertorySchema");
const Storage = require("../models/storageSchema");
const InventoryRequest = require("../requests/inventoryRequest");
const Farmer = require("../models/farmerSchema")
const mongoose = require("mongoose");
const BuyService = require("../services/buyerService")

const secretKey = process.env.TOKEN_SECRET;

const extractUserFromToken = async (req, Model) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res.status(403).send("A token is required for authentication");
    const identifier = jwt.verify(token, secretKey);
    let User;
    User = await Model.findOne({ mobile: identifier });
    if (!User) {
      User = await Model.findOne({ email: identifier });
      if (!User)
        return res
          .status(402)
          .send(
            "You are not permitted to add new inventory, Please login again!"
          );
    }
    return User;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};

const addInventory = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const request = new InventoryRequest(req.body);
    request.owner = ownerId;
    await inventory.create(request);
    res.json({ status: "Inventory added successfully", data: request });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const getMyInventory = async (req, res) => {
  try {
    const {ownerId} = req.query;
    const inventories = await inventory.find({ owner : ownerId }).sort({ _id: -1 });
    res.json({ status: "Inventory fetched successfully", data: inventories });
  } catch (error) {
    if (error.status === "fail") res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const getInventoriesNearMe = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const inventories = await inventory.find({
        "location.coordinates": {
          $near: {
            $geometry: { type: "Point", coordinates: [lat, lng] },
            $maxDistance: 60000
          }
        }
      }).sort({ _id: -1 });
    res.json({ status: "Inventory fetched successfully", data: inventories });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const buyInventory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const farmer = await extractUserFromToken(req, Farmer);
    let { inventoryId, quantity, exitDate } = req.body;
    quantity = parseInt(quantity)
    const Inventory = await inventory.findById(inventoryId).session(session);
    if (!Inventory) return res.status(404).send("Inventory not found");
    if (Inventory.reservedQuantity + quantity > Inventory.totalQuantity) return res.status(400).send("Insufficient space available");
    const storageOwner = await Storage.findById(Inventory.owner)
    // call the buyer services here
    const order = await BuyService.buyInventory(farmer, storageOwner, Inventory, quantity, exitDate, session)
    await session.commitTransaction();
    res.json({ status: "payment initiated", data: order });
  } catch (error) {
    console.error(error)
    await session.abortTransaction();
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }finally {
    session.endSession();
  }
}

const verifyPurchase = async (req, res) => {
  try{
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
    const response = await BuyService.updateStatus(order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature)
    return res.json({ status: "payment successful", data: response });
  }catch(error){
    console.error(error)
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
}

const getThisInventory = async (req, res) => {
  const {inventoryId} = req.params
  const inventoryItem = await inventory.findById(inventoryId).select("location _id name crop totalQuantity reservedQuantity pricePerUnit owner status")
  if (inventoryItem){
    return res.json({status: "fetched succesfully", data: inventoryItem})
  }else{
    return res.status(404).send({error: "Inventory not found"})
  }
}

module.exports = {
  addInventory,
  getMyInventory,
  getInventoriesNearMe,
  buyInventory,
  verifyPurchase,
  getThisInventory,
};
