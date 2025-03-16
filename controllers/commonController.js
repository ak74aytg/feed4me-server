const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Inventory = require("../models/invertorySchema");
const storageOwner = require("../models/storageSchema");
const Farmer = require("../models/farmerSchema");

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
    }
    return User;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};

const getInventory = async (req, res) => {
  try {
    let user = await extractUserFromToken(req, storageOwner);
    if (!user) user = await extractUserFromToken(req, Farmer);
    if (!user) {
      return res
        .status(402)
        .send(
          "Invalid token, Please login again!"
        );
    }
    const inventoryId = req.params.id;
    const inventory = await Inventory.findById(inventoryId);
    res.json({ status: "Inventory fetched successfully", data: inventory });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getInventory,
};
