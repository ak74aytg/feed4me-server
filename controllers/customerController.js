const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Customer = require("../models/customerSchema")
const InventoryRequest = require("../requests/inventoryRequest")
const Inventory = require("../models/invertorySchema")

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

module.exports = {
    addInventory,
}