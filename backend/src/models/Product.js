const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a product description"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please add a product price"],
    min: [0, "Price must be positive"],
  },
  stock: {
    type: Number,
    required: [true, "Please add product stock"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
 imageUrl: [{
    type: String,
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
