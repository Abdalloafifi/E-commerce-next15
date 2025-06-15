
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifytoken');
const {
  getUserProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');

router.route('/profile')
  .get(verifyToken, getUserProfile)
  .put(verifyToken, updateProfile);

router.route('/change-password')
  .put(verifyToken, changePassword);

module.exports = router;
