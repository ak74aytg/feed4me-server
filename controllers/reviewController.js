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
      return res.status(400).json({ error: "Duplicate review not allowed" });
    }
    const review = new Review({
        username: farmer._id,
        inventory: inventoryId,
        rating,
        comment,
        helpfulCount,
    });
    await review.save();
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
    const reviews = await Review.find({inventory: inventoryId})
        .populate("username", "name email profile_image")
        .select("rating comment helpfulCount created_at username")
        .sort({ helpfulCount: -1 });
    
        reviews.forEach(review => {
          if (review.username && review.username.profile_image) {
            review.username.profile_image = "https://api.feed4me.in" + review.username.profile_image;
          }
        }); 
    return res.json({ status: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const farmer = await extractUserFromToken(req, Farmer);
    const reviews = await Review.find({ username: farmer.id })
    .populate("inventory", "name description crop")
    .select("rating comment helpfulCount created_at inventory")
    .sort({
      helpfulCount: -1,
    });
    return res.json({ status: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRecentReviews = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    if (!inventoryId) {
      return res.status(400).json({ error: "InventoryId is required" });
    }

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }
    const reviews = await Review.find({inventory: inventoryId})
        .populate("username", "name email profile_image")
        .select("rating comment helpfulCount created_at username")
        .sort({ helpfulCount: -1 })
        .limit(2);
    reviews.forEach(review => {
      if (review.username && review.username.profile_image) {
        review.username.profile_image = "https://api.feed4me.in" + review.username.profile_image;
      }
    });
    return res.json({ status: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getRatingsSummary = async (req, res) => {
    try {
      const { inventoryId } = req.params;
      if (!inventoryId) {
        return res.status(400).json({ error: "InventoryId is required" });
      }
  
      const inventory = await Inventory.findById(inventoryId);
      if (!inventory) {
        return res.status(404).json({ error: "Inventory not found" });
      }
      const rating = await Review.aggregate([
        { $match: { inventory: new mongoose.Types.ObjectId(inventoryId) } },
        {
          $group: {
            _id: "$inventory",
            averageRating: {$avg : "$rating"},
            totalRatings: {$sum : 1 },
            ratingsBreakdown: {
              $push: "$rating"
            }
          }
        },
        {
          $project: {
            averageRating: 1,
            totalRatings: 1,
            ratingCount: {
              $arrayToObject: {
                $map: {
                  input: [1,2,3,4,5],
                  as: "r",
                  in: {
                    k: {$toString: "$$r"},
                    v: {
                      $size: {
                        $filter: {
                          input: "$ratingsBreakdown",
                          as: "x",
                          cond : {$eq: ["$$x", "$$r"]}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ])

      
      return res.json({ status: "Reviews fetched successfully", data: rating[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createReview,
  getReviewsForInventory,
  getMyReviews,
  getRatingsSummary,
  getRecentReviews,
};
