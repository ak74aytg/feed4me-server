const CustomError = require("../utils/customError");
const Inventory = require("../models/invertorySchema");

const removeExpiredRentals = async () => {
  try {
    const now = new Date();
    const inventories = await Inventory.find();
    for (let inventory of inventories){
      let spaceRecovered = 0
      for (let entry of inventory.takenBy){
        if (!entry.exitDate){
          spaceRecovered += entry.quantity
          entry.status = "expired";
          continue;
        }
        const exitDate = new Date(entry.exitDate)
        if (exitDate <= now){
          spaceRecovered += entry.quantity
          entry.status = "expired"
          continue;
        }
        const buyDate = new Date(entry.date)
        if (entry.status === "inactive" && buyDate < new Date(now.getTime() - 24*60*60*1000)){
          spaceRecovered += entry.quantity
          entry.status = "expired"
          continue
        }
      }
      if (spaceRecovered > 0) {
        inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - spaceRecovered);
        if (inventory.reservedQuantity < inventory.totalQuantity) {
          inventory.status = "available";
        }
        await inventory.save();
      }
    }


    console.log("Expired rentals removed and reserved space updated.");
  } catch (error) {
    console.error("Error in removing expired rentals:", error);
  }
};

module.exports = {
  removeExpiredRentals,
};
