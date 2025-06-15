const User = require("../models/User");
const xss = require('xss');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");
const asyncHandler = require('express-async-handler');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

// @desc    Update user profile (name, email)
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Please provide name and email"
      });
    }
    
    const cleanName = xss(name);
    const cleanEmail = xss(email);
    
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email"
      });
    }
    
    const existingUser = await User.findOne({ email: cleanEmail, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already in use by another account"
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: cleanName,
        email: cleanEmail
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current and new password"
      });
    }
    
    const user = await User.findById(req.user.id).select('+password');
    
    const isMatch = await user.matchPassword(xss(currentPassword));
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect"
      });
    }
    
    const passwordComplexitySchema = Joi.object({
      password: passwordComplexity({
        min: 8,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
      }),
    });
    
    const { error } = passwordComplexitySchema.validate({ password: newPassword });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});