const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
