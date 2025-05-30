const express = require("express");
const { checkout } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/checkout", protect, checkout);

module.exports = router;
