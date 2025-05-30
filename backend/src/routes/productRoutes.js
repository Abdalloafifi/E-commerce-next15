const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProductStock,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getProducts).post(protect, createProduct);
router.route("/:id").get(getProduct);
router.route("/:id/stock").put(protect, updateProductStock);

module.exports = router;
