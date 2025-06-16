const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProductStock,
  deleteProduct
} = require("../controllers/productController");
const { protect } = require('../middleware/auth');
const {optimizeAndPrepare, upload}= require("../middleware/uplod")
const router = express.Router();

router.route("/").get( getProducts).post(protect, upload.array("image"), optimizeAndPrepare, createProduct);
router.route("/:id").get( getProduct);
router.route("/:id/stock").put(protect, updateProductStock);
router.route("/:id").delete(protect, deleteProduct);

module.exports = router;
