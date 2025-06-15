const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProductStock,
  deleteProduct
} = require("../controllers/productController");
const { verifyToken,verifyTokenAndAdmin } = require('../middleware/verifytoken');
const {optimizeAndPrepare, upload}= require("../middleware/uplod")
const router = express.Router();

router.route("/").get(verifyToken, getProducts).post(verifyTokenAndAdmin, upload.array("image"), optimizeAndPrepare, createProduct);
router.route("/:id").get(verifyToken, getProduct);
router.route("/:id/stock").put(verifyTokenAndAdmin, updateProductStock);
router.route("/:id").delete(verifyTokenAndAdmin, deleteProduct);

module.exports = router;
