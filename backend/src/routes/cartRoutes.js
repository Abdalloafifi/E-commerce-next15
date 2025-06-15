const express = require("express");
const { checkout } = require("../controllers/cartController");
const { verifyToken } = require('../middleware/verifytoken');
const router = express.Router();

router.post("/checkout", verifyToken, checkout);

module.exports = router;
