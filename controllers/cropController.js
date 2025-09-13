const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const CropDetails = require("../models/cropDetailSchema");
const Farmer = require("../models/farmerSchema");
const fs = require("fs");
const path = require("path");

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


//add crops
const addCropDetails = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const farmer = await Farmer.findOne({
      $or: [{ mobile: identifier }, { email: identifier }],
    });
    if (!farmer) return res.status(402).send("Token expired. Please login again!");
    let { name, MRP, stock, description, category, location, harvest_date, expiry_date, min_order } = req.body;
    harvest_date = harvest_date ? new Date(harvest_date) : null;
expiry_date = expiry_date ? new Date(expiry_date) : null;

// Check validity
if (harvest_date && isNaN(harvest_date.getTime())) {
  return res.status(400).json({ error: "Invalid harvest_date format. Use YYYY-MM-DD." });
}
if (expiry_date && isNaN(expiry_date.getTime())) {
  return res.status(400).json({ error: "Invalid expiry_date format. Use YYYY-MM-DD." });
}
    const newCrop = new CropDetails({ farmerID: farmer._id, name: name, MRP: MRP, initial_stock: stock, stock: stock, description: description, category: category , location: location, harvest_date : harvest_date, expiry_date: expiry_date, minimum_order_quantity: min_order });
    const savedCrop = await newCrop.save();
    if (req.file) {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      const ext = path.extname(req.file.originalname);
      const fileName = `${savedCrop._id}-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
      savedCrop.imageUrl = `/uploads/${fileName}`;
      await savedCrop.save();
    }
    // const cropList = savedCrop.map((crop) => {
      const {imageUrl, ...item} = savedCrop.toObject();
      const cropItem = {
        imageUrl : imageUrl ? `${BASE_URL}${imageUrl}` : null,
        ...item,
      }
    // })
    res.json({ status: "Crop added successfully", data: cropItem });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const getCropList = async (req, res) => {
  const cropList = await CropDetails.find()
  .select("farmerID name imageUrl MRP stock description category location harvest_date expiry_date minimum_order_quantity stock_status")
  .sort({ _id: -1 });
  const crops = cropList.map((crop) => {
    const cropObj = crop.toObject();
    const {imageUrl, ...item} = cropObj;
    return {
      imageUrl : imageUrl ? `${BASE_URL}${imageUrl}` : null,
      ...item,
    }
  })
  return res.send({status : 'success', data : crops});
}

module.exports = {
  addCropDetails,
  getCropList
};
