const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Inventory = require("../models/invertorySchema");
const Review = require("../models/reviewSchema");
const Farmer = require("../models/farmerSchema");
const mongoose = require("mongoose");

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
          .send("You are not permitted, Please login again!");
    }
    return User;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};

const createReview = async (req, res) => {
  try {
    const farmer = await extractUserFromToken(req, Farmer);
    const { inventoryId, rating, comment, helpfulCount } = req.body;
    if (!inventoryId) {
      return res
        .status(400)
        .json({ error: { inventoryId: "incomplete data!" } });
    }
    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }
    const existingReview = await Review.findOne({
      username: farmer._id,
      inventory: inventoryId,
    });
    if (existingReview) {
      existingReview.rating = rating ? rating : existingReview.rating
      existingReview.comment = comment ? comment : existingReview.comment
      existingReview.helpfulCount = helpfulCount ? helpfulCount : existingReview.helpfulCount
      await existingReview.save()
    } else {
      const review = new Review({
        username: farmer._id,
        inventory: inventoryId,
        rating,
        comment,
        helpfulCount,
    });
    await review.save();
    }
    return res.json({ status: "Review added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate review not allowed" });
    }
    return res.status(500).json({ error: error.message });
  }
};

const getReviewsForInventory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    if (!inventoryId) {
      return res.status(400).json({ error: "InventoryId is required" });
    }

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }
    const reviews = await Review.find({
        inventory: new mongoose.Types.ObjectId(inventoryId),
        
            $or: [
              { rating: { $exists: true, $ne: 0 } },
              { helpfulCount: { $exists: true, $ne: 0 } }
            ]
                    
      })
        .populate("username", "name email")
        .select("rating comment helpfulCount created_at username")
        .sort({ created_at: -1 });      
    

    return res.json({ status: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const farmer = await extractUserFromToken(req, Farmer);
    const reviews = await Review.find({ username: farmer.id ,
            $or: [
              { rating: { $exists: true, $ne: 0 } },
              { helpfulCount: { $exists: true, $ne: 0 } }
            ]          
    })
    .populate("inventory", "name description crop")
    .select("rating comment helpfulCount created_at inventory")
    .sort({
      created_at: -1,
    });
    return res.json({ status: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createRating = async (req, res) => {
    console.log("inside")
    try {
      const farmer = await extractUserFromToken(req, Farmer);
      const { inventoryId, averageRating, totalReviews, starCounts } = req.body;
      if (!inventoryId) {
        return res
          .status(400)
          .json({ error: { inventoryId: "incomplete data!" } });
      }
      const inventory = await Inventory.findById(inventoryId);
      if (!inventory) {
        return res.status(404).json({ error: "Inventory not found" });
      }
      const existingReview = await Review.findOne({
        username: farmer._id,
        inventory: inventoryId,
      });
      if (existingReview) {
        existingReview.averageRating = averageRating ? averageRating : existingReview.averageRating
        existingReview.totalReviews = totalReviews ? totalReviews : existingReview.totalReviews
        existingReview.starCounts = starCounts ? starCounts : existingReview.starCounts
        await existingReview.save()
      } else {
        const review = new Review({
          username: farmer._id,
          inventory: inventoryId,
          averageRating,
          totalReviews,
          starCounts,
      });
      await review.save();
      }
      return res.json({ status: "Rating added successfully" });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Duplicate rating not allowed" });
      }
      return res.status(500).json({ error: error.message });
    }
  };

  const getMyRating = async (req, res) => {
    try {
      const farmer = await extractUserFromToken(req, Farmer);
      const ratings = await Review.find({ username: farmer.id ,
        $or: [
            { averageRating: { $ne: 0 } },
            { totalReviews: { $ne: 0 } }
          ]
      })
      .populate("inventory", "name description crop")
      .select("starCounts averageRating totalReviews created_at inventory")
      .sort({
        created_at: -1,
      });
      return res.json({ status: "Ratings fetched successfully", data: ratings });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

const getRatingsForInventory = async (req, res) => {
    try {
      const { inventoryId } = req.params;
      if (!inventoryId) {
        return res.status(400).json({ error: "InventoryId is required" });
      }
  
      const inventory = await Inventory.findById(inventoryId);
      if (!inventory) {
        return res.status(404).json({ error: "Inventory not found" });
      }
      const reviews = await Review.find({
        inventory: new mongoose.Types.ObjectId(inventoryId),
        $or: [
            { averageRating: { $ne: 0 } },
            { totalReviews: { $ne: 0 } }
          ]
      })
        .populate("username", "name email")
        .select("starCounts averageRating totalReviews created_at username")
        .sort({ created_at: -1 });
  
      return res.json({ status: "Reviews fetched successfully", data: reviews });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createReview,
  getReviewsForInventory,
  getMyReviews,
  createRating,
  getMyRating,
  getRatingsForInventory,
};
