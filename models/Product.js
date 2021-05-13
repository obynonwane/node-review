const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  product: {
    type: String,
  },

  total: Number,

  customer: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
