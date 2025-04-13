const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const farmerResponse = require("../response/farmerRequest");
const Farmer = require("../models/farmerSchema");
const CropDetails = require("../models/cropDetailSchema");
const mongoose = require("mongoose");
const Inventory = require("../models/invertorySchema");
const News = require("../models/newsSchema")
const InventoryRequest = require("../requests/inventoryRequest")

const secretKey = process.env.TOKEN_SECRET;
const BASE_URL = "http://localhost:3000";

const extractUsernameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};

//get all farmers information
const getAllFarmersController = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.json({ status: "Farmers fetched successfully", data: farmers });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

//get farmer by id
const getFarmerController = async (req, res) => {
  try {
    const { parameter } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(parameter);
    const user = await Farmer.findOne({
      $or: [
        isValidObjectId ? { _id: parameter } : null,
        { email: parameter },
        { mobile: parameter },
        { name: parameter },
      ].filter(Boolean),
    });
    if (!user) return res.status(404).send({ error: "Farmer not found" });
    res.json({ status: "Farmer fetched successfully", data: user });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

//get farmers profile
const getMyProfile = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const user = await Farmer.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
    if (!user) return res.status(402).send("token expired. Please login again!");
    const farmerRes = new farmerResponse( user._id, user.name, user.age, user.location, user.mobile, user.email );
    const farmerID = user._id;
    const crops = await CropDetails.find({ farmerID: farmerID });
    for (let crop of crops) farmerRes.addCrop(crop.name, crop.MRP, crop.stock);
    const inventories = await Inventory.find({
      takenBy: { $elemMatch: { farmer: farmerID } }
    });
    for(let i = 0; i < inventories.length; i++){
      const item = inventories[i];
      let area = 0;
      for(let j=0;j<item.takenBy.length;j++){
        if(item.takenBy[j].farmer == farmerID.toString()){
          area += item.takenBy[j].quantity;
        }
      }
      farmerRes.addInventory(item._id, item.name, item.crop, area, area*item.pricePerUnit, item.owner);
    }
    res.json({ status: "Farmer fetched successfully", data: farmerRes });
  } catch (error) {
    if (error.status === "fail") res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

//update farmers information
const updateInfo = async (req, res) => {
  try {
    const { name, age, location } = req.body;
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const farmer = await Farmer.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
    if (!farmer) return res.status(402).send("Token expired. Please login again!");
    const updates = {};
    if (name) updates.name = name;
    if (age) updates.age = age;
    if (location) updates.location = location;
    if (Object.keys(updates).length === 0) return res.status(400).send({ error: "No data provided to update" });
    const updatedFarmer = await Farmer.findOneAndUpdate(
      { _id: farmer._id },
      updates,
      { new: true, runValidators: true }
    );
    return res.json({ status: "Farmer data updated successfully", data: updatedFarmer });
  } catch (error) {
    console.error("Error updating farmer:", error);
    res.status(500).send({ error: error.message });
  }
};

const getNews = async (req, res) => {
  const { tag, lang } = req.query;
  const filter = { 
    ...(tag && { tags: tag }),
    ...(lang && { language: lang }),
    $or: [{ validTill: { $gte: new Date() } }, { validTill: null }]
  };
  const news = await News.find(filter).sort({ createdAt: -1 });
  const newsList = news.map(item => {
    return {
      ...item.toObject(),
      imageUrl: `${BASE_URL}${item.imageUrl}`
    };
  });
  res.json({ status: "success", data : newsList });
}

const addInventory = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const farmer = await Farmer.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
    if (!farmer) return res.status(402).send("Token expired. Please login again!");
    const request = new InventoryRequest(req.body);
    request.owner = farmer._id;
    await Inventory.create(request);
    res.json({ status: "Inventory added successfully", data: request });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getAllFarmersController,
  getFarmerController,
  getMyProfile,
  updateInfo,
  getNews,
  addInventory
};
