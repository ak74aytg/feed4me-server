const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    require: true,
  },
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmers",
    required: true,
  },
  rating: Number,
  comment: String,
  helpfulCount: Number,
  starCounts: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 },
  },
  averageRating: Number,
  totalReviews: Number,
  created_at: { type: Date, default: Date.now },
});
// Create compound unique index on inventory and username combination
reviewSchema.index({ inventory: 1, username: 1 }, { unique: true });
module.exports = mongoose.model("Review", reviewSchema);
