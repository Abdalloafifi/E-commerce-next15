const Product = require("../models/Product");
const socketio = require("../config/socketio");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Create a product (admin only in a real app)
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // Notify all clients about new product
    socketio.getIO().emit("products", { action: "create", product });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private
exports.updateProductStock = async (req, res) => {
  try {
    const { newStock } = req.body;

    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        error: "Stock cannot be negative",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: newStock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Notify all clients about stock update
    socketio.getIO().emit("products", { action: "update", product });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
