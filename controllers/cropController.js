const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const CropDetails = require("../models/cropDetailSchema");
const Farmer = require("../models/farmerSchema");

const secretKey = process.env.TOKEN_SECRET;

const extractUsernameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};


//add crops
const addCropDetails = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("A token is required for authentication");
    const mobile = extractUsernameFromToken(token);
    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) return res.status(402).send("Token expired. Please login again!");
    const { name, MRP, stock } = req.body;
    const newCrop = new CropDetails({ farmerID: farmer._id, name, MRP, stock });
    await newCrop.save();
    res.json({ status: "Crop added successfully", data: newCrop });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addCropDetails,
};
