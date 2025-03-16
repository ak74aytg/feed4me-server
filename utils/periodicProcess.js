const CustomError = require("../utils/customError");
const Inventory = require("../models/invertorySchema");

const removeExpiredRentals = async () => {
  try {
    const now = new Date();
    const inventories = await Inventory.find({
      "takenBy.exitDate": { $lte: now },
    });
    for (const inventory of inventories) {
      let updatedTakenBy = [];
      updatedTakenBy = inventory.takenBy.filter((entry) => {
        if (!entry.exitDate) return true;
        const exitDate = new Date(entry.exitDate);
        return exitDate > now;
      });
      let freedSpace = inventory.takenBy
        .filter((entry) => entry.exitDate <= now)
        .reduce((sum, entry) => sum + entry.quantity, 0);
      await Inventory.findByIdAndUpdate(inventory._id, {
        takenBy: updatedTakenBy,
        $inc: { reservedQuantity: -freedSpace },
      });
    }

    console.log("Expired rentals removed and reserved space updated.");
  } catch (error) {
    console.error("Error in removing expired rentals:", error);
  }
};

module.exports = {
  removeExpiredRentals,
};
