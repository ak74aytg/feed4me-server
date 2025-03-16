const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const inventory = require("../models/invertorySchema");
const storageOwner = require("../models/storageSchema");
const InventoryRequest = require("../requests/inventoryRequest");
const Farmer = require("../models/farmerSchema")

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
    const Owner = await extractUserFromToken(req, storageOwner);
    const request = new InventoryRequest(req.body);
    request.owner = Owner._id;
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
    const Owner = await extractUserFromToken(req, storageOwner);
    const inventories = await inventory.find({ owner: Owner._id });
    res.json({ status: "Inventory fetched successfully", data: inventories });
  } catch (error) {
    if (error.status === "fail") res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const getInventoriesNearMe = async (req, res) => {
  try {
    const  farmer = await extractUserFromToken(req, Farmer);
    const lat = parseFloat(req.query.lat) || farmer.location.coordinates.coordinates[0];
    const lng = parseFloat(req.query.lng) || farmer.location.coordinates.coordinates[1];
    const inventories = await inventory.find({
        "location.coordinates": {
          $near: {
            $geometry: { type: "Point", coordinates: [lat, lng] },
            $maxDistance: 60000 // 60 km radius
          }
        }
      });
    res.json({ status: "Inventory fetched successfully", data: inventories });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};

const buyInventory = async (req, res) => {
  try {
    const  farmer = await extractUserFromToken(req, Farmer);
    const { inventoryId, quantity, exitDate } = req.body;
    const Inventory = await inventory.findById(inventoryId);
    if (!Inventory) return res.status(404).send("Inventory not found");
    if (Inventory.quantity < quantity) return res.status(400).send("Insufficient space available");
    Inventory.reservedQuantity += quantity;
    if(Inventory.reservedQuantity > Inventory.totalQuantity) res.status(400).send("Insufficient space available");
    const expDate = exitDate ? new Date(exitDate) : Date.now() + (1000 * 60 * 60 * 24 * 28);``
    Inventory.takenBy.push({ farmer : farmer._id, quantity : quantity, date: Date.now(), exitDate: expDate });
    if(Inventory.reservedQuantity == Inventory.totalQuantity) Inventory.status = "full";
    await Inventory.save();
    const Supplier = await storageOwner.findById(Inventory.owner);
    const invoice = {};
    invoice.farmer = farmer._id;
    invoice.name = farmer.name;
    invoice.seller = {
      name: Supplier.name,
      mobile: Supplier.mobile,
      email: Supplier.email,
      address: Supplier.location.address,
    }
    invoice.inventory = {
      id: Inventory._id,
      name: Inventory.name,
      location: Inventory.location.address,
    }
    invoice.quantity = quantity;
    invoice.totalPrice = quantity * Inventory.pricePerUnit;
    invoice.date = new Date();

    // Send invoice email or create invoice record in database
    // await invoice.save();

    res.json({ status: "Inventory purchased successfully", invoice: invoice });
  } catch (error) {
    if (error.status === "fail")
      res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
}

module.exports = {
  addInventory,
  getMyInventory,
  getInventoriesNearMe,
  buyInventory,
};
