const User = require("../models/User");
const passwordComplexity = require("joi-password-complexity");
const xss = require('xss');
const Joi = require('joi');
const { generateTokenAndSend } = require('../middleware/genarattokenandcookies');
const asyncHandler = require('express-async-handler');


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
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
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, and password",
      });
    }

    const { error } = passwordComplexitySchema.validate({ password });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // Create user
    const user = await User.create({
      name: xss(name),
      email: xss(email),
      password: xss(passwordComplexitySchema),
    });
    generateTokenAndSend(user, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email: xss(email) }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(xss(password));

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    generateTokenAndSend(user, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});



// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});
