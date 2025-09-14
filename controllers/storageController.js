const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const inventory = require("../models/invertorySchema");
const Storage = require("../models/storageSchema");
const InventoryRequest = require("../requests/inventoryRequest");
const Farmer = require("../models/farmerSchema");
const mongoose = require("mongoose");
const BuyService = require("../services/buyerService");

const secretKey = process.env.TOKEN_SECRET;
const BASE_URL = "https://api.feed4me.in";

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
  // try {
  //   const { ownerId } = req.query;
  //   const request = new InventoryRequest(req.body);
  //   request.owner = ownerId;

  //   await inventory.create(request);
  //   res.json({ status: "Inventory added successfully", data: request });
  // } catch (error) {
  //   if (error.status === "fail")
  //     res.status(error.statusCode).send({ error: error.message });
  //   else res.status(500).send({ error: error.message });
  // }
  try {
    // const token = req.headers["authorization"]?.split(" ")[1];
    // if (!token)
    //   return res.status(403).send("A token is required for authentication");
    const owner = await extractUserFromToken(req, Storage);
    // const owner = await Customer.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
    if (!owner)
      return res.status(402).send("Token expired. Please login again!");
    let location = req.body.location;
    if (typeof location === "string") {
      try {
        location = JSON.parse(location);
      } catch (err) {
        return res
          .status(400)
          .json({ error: "Invalid location format, must be JSON" });
      }
    }
    const request = new InventoryRequest({ ...req.body, location });
    request.owner = owner._id;
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    }
    request.images = imagePaths;
    const savedInventory = await inventory.create(request);
    for (let i=0;i<savedInventory.images.length;i++){
      savedInventory.images[i] = BASE_URL+savedInventory.images[i];
    }
    res.json({ status: "Inventory added successfully", data: savedInventory });
  } catch (error) {
    console.error(error)
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const getMyInventory = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const inventories = await inventory
      .find({ owner: ownerId })
      .sort({ _id: -1 });
    for (let inventory of inventories){
      for (let i = 0; i < inventory?.images?.length; i++) {
        inventory.images[i] = BASE_URL + inventory.images[i];
      }
    }
    res.json({ status: "Inventory fetched successfully", data: inventories });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const getInventoriesNearMe = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const inventories = await inventory
      .find({
        "location.coordinates": {
          $near: {
            $geometry: { type: "Point", coordinates: [lat, lng] },
            $maxDistance: 60000,
          },
        },
      })
      .sort({ _id: -1 });
    for (let i = 0; i < inventories?.images?.length; i++) {
      inventories.images[i] = BASE_URL + inventories.images[i];
    }
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
    quantity = parseInt(quantity);
    const Inventory = await inventory.findById(inventoryId).session(session);
    if (!Inventory) return res.status(404).send("Inventory not found");
    if (Inventory.reservedQuantity + quantity > Inventory.totalQuantity)
      return res.status(400).send("Insufficient space available");
    const storageOwner = await Storage.findById(Inventory.owner);
    // call the buyer services here
    const order = await BuyService.buyInventory(
      farmer,
      storageOwner,
      Inventory,
      quantity,
      exitDate,
      session
    );
    await session.commitTransaction();
    res.json({ status: "payment initiated", data: order });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  } finally {
    session.endSession();
  }
};

const verifyPurchase = async (req, res) => {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    const response = await BuyService.updateStatus(
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    return res.json({ status: "payment successful", data: response });
  } catch (error) {
    console.error(error);
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const getThisInventory = async (req, res) => {
  const { inventoryId } = req.params;
  const inventoryItem = await inventory
    .findById(inventoryId)
    .select(
      "location _id name images crop totalQuantity reservedQuantity pricePerUnit owner status images"
    );
  for (let i = 0; i < inventoryItem?.images?.length; i++) {
      inventoryItem.images[i] = BASE_URL + inventoryItem.images[i];
    }
  if (inventoryItem) {
    return res.json({ status: "fetched succesfully", data: inventoryItem });
  } else {
    return res.status(404).send({ error: "Inventory not found" });
  }
};

module.exports = {
  addInventory,
  getMyInventory,
  getInventoriesNearMe,
  buyInventory,
  verifyPurchase,
  getThisInventory,
};
