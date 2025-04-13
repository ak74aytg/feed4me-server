// models/FarmerNews.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  imageUrl: { type: String },
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
  authorName : {type: String},
});

module.exports = mongoose.model('News', newsSchema);
