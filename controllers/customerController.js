const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Customer = require("../models/customerSchema")
const InventoryRequest = require("../requests/inventoryRequest")
const Inventory = require("../models/invertorySchema")
const Purchases = require('../models/purchaseDetailsSchema')
const Farmer = require('../models/farmerSchema')
const Crop = require('../models/cropDetailSchema')

const secretKey = process.env.TOKEN_SECRET;

const extractUsernameFromToken = (token) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      throw new CustomError("Invalid token", 401);
    }
  };

const addInventory = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const owner = await Customer.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
    if (!owner) return res.status(402).send("Token expired. Please login again!");
    const request = new InventoryRequest(req.body);
    request.owner = owner._id;
    await Inventory.create(request);
    res.json({ status: "Inventory added successfully", data: request });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const buyCrops = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token) return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const user = await Customer.findOne({ $or: [{mobile : identifier} , {email: identifier}]});
    if(!user) return res.status(402).send("Token expired, Please login again!");
    
    const { sellerId, buyerId, cropId, amount } = req.body;
    const crop = await Crop.findById(cropId);
    if(!crop) return res.status(404).send("crop not found!");
    if(crop.stock < amount){
      return res.status(404).send("not enough stock");
    }
    crop.stock -= amount;
    await crop.save();
    let purchase = await Purchases.findOne({
      sellerId,
      buyerId,
      cropId
    });
    if(!purchase) {
      purchase = await Purchases.create({seller : sellerId, buyer: buyerId, crop : cropId, quantity : amount});
    }else{
      purchase.quantity -= amount;
      await purchase.save();
    }
    return res.send({ status : "success" , data : purchase});
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
}

module.exports = {
    addInventory,
    buyCrops,
}