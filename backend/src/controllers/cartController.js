const Product = require("../models/Product");
const Order = require("../models/Order");
const socketio = require("../config/socketio");
const { startSession } = require("mongoose");

// @desc    Process checkout
// @route   POST /api/cart/checkout
// @access  Private
exports.checkout = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No cart items provided",
      });
    }

    // Verify stock availability and calculate total
    let totalPrice = 0;
    const orderItems = [];
    const stockUpdates = [];

    // Use a transaction for atomicity
    const session = await startSession();
    session.startTransaction();

    try {
      // Check each item in cart
      for (const item of cartItems) {
        const product = await Product.findById(item.productId).session(session);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.qty) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stock}`
          );
        }

        // Update stock
        const newStock = product.stock - item.qty;
        await Product.findByIdAndUpdate(
          item.productId,
          { stock: newStock },
          { new: true, runValidators: true, session }
        );

        // Add to order items
        orderItems.push({
          name: product.name,
          qty: item.qty,
          price: product.price,
          product: item.productId,
        });

        // Calculate item total and add to order total
        totalPrice += product.price * item.qty;

        // Store stock update for notification
        stockUpdates.push({
          productId: item.productId,
          newStock: newStock,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            stock: newStock,
            imageUrl: product.imageUrl,
          },
        });
      }

      // Create order
      const order = await Order.create(
        [
          {
            user: req.user.id,
            orderItems,
            totalPrice,
          },
        ],
        { session }
      );

      // Commit transaction
      await session.commitTransaction();

      // Notify all clients about stock updates
      stockUpdates.forEach((update) => {
        socketio.getIO().emit("products", {
          action: "update",
          product: update.product,
        });
      });

      res.status(201).json({
        success: true,
        data: {
          order: order[0],
          message: "Order placed successfully",
        },
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
