const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Customer = require("../models/customerSchema");
const InventoryRequest = require("../requests/inventoryRequest");
const Inventory = require("../models/invertorySchema");
const Purchases = require("../models/purchaseDetailsSchema");
const Farmer = require("../models/farmerSchema");
const Crop = require("../models/cropDetailSchema");

const secretKey = process.env.TOKEN_SECRET;
const BASE_URL = "https://api.feed4me.in";

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
    if (!token)
      return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const owner = await Customer.findOne({
      $or: [{ mobile: identifier }, { email: identifier }],
    });
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
    const savedInventory = await Inventory.create(request);
    for (let i = 0; i < savedInventory?.images?.length; i++) {
      savedInventory.images[i] = BASE_URL + savedInventory.images[i];
    }
    res.json({ status: "Inventory added successfully", data: savedInventory });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const buyCrops = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const user = await Customer.findOne({
      $or: [{ mobile: identifier }, { email: identifier }],
    });
    if (!user)
      return res.status(402).send("Token expired, Please login again!");

    const { sellerId, buyerId, cropId, amount } = req.body;
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).send("crop not found!");
    if (crop.stock < amount) {
      return res.status(404).send("not enough stock");
    }
    crop.stock -= amount;
    await crop.save();
    let purchase = await Purchases.findOne({
      sellerId,
      buyerId,
      cropId,
    });
    if (!purchase) {
      purchase = await Purchases.create({
        seller: sellerId,
        buyer: buyerId,
        crop: cropId,
        quantity: amount,
      });
    } else {
      purchase.quantity -= amount;
      await purchase.save();
    }
    return res.send({ status: "success", data: purchase });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addInventory,
  buyCrops,
};
