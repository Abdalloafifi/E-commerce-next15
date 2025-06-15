const Product = require("../models/Product");
const socketio = require("../config/socketio");
const { generateTokenAndSend } = require('../middleware/genarattokenandcookies');
const cloudinary = require("../config/cloudinary"); 
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
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
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
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
});

// @desc    Create a product (admin only in a real app)
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  try {
    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      // Decompress the gzipped file before uploading to Cloudinary
      const decompressedBuffer = await new Promise((resolve, reject) => {
        zlib.gunzip(file.buffer, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype.replace('.gz', '')};base64,${decompressedBuffer.toString('base64')}`,
        {
          folder: 'products',
          resource_type: 'auto'
        }
      );
      imageUrls.push(result.secure_url);
    }

    const productData = {
      ...req.body,
      imageUrl: imageUrls
    };

    const product = await Product.create(productData);

    socketio.getIO().emit("products", { action: "create", product });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private
exports.updateProductStock = asyncHandler(async (req, res) => {
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
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    for (const imageUrl of product.imageUrl) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(req.params.id);

    socketio.getIO().emit("products", { action: "delete", product });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});