const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { generateOTP, sendOTPEmail } = require('../services/otpService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Send OTP for registration
// @route   POST /api/auth/send-otp
const sendOTP = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    res.status(400);
    throw new Error('Email and name are required');
  }

  // Validate college email
  if (!email.endsWith('@srmap.edu.in')) {
    res.status(400);
    throw new Error('Please use your SRM AP college email (@srmap.edu.in)');
  }

  // Check if already registered
  const userExists = await User.findOne({ email });
  if (userExists && userExists.isVerified) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save or update user with OTP
  if (userExists) {
    userExists.otp = { code: otp, expiresAt };
    userExists.name = name;
    await userExists.save();
  } else {
    await User.create({
      name,
      email,
      password: 'temp_' + otp,
      otp: { code: otp, expiresAt },
      isVerified: false
    });
  }

  // Send OTP email
  await sendOTPEmail(email, otp, name);

  res.json({ message: 'OTP sent successfully to your college email!' });
});

// @desc    Register with OTP verification
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, otp } = req.body;

  if (!name || !email || !password || !otp) {
    res.status(400);
    throw new Error('All fields including OTP are required');
  }

  if (!email.endsWith('@srmap.edu.in')) {
    res.status(400);
    throw new Error('Please use your SRM AP college email (@srmap.edu.in)');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('Please request OTP first');
  }

  // Verify OTP
  if (!user.otp || !user.otp.code) {
    res.status(400);
    throw new Error('No OTP found. Please request a new OTP');
  }

  if (user.otp.code !== otp) {
    res.status(400);
    throw new Error('Invalid OTP. Please check your email');
  }

  if (new Date() > user.otp.expiresAt) {
    res.status(400);
    throw new Error('OTP has expired. Please request a new one');
  }

  // Update user
  user.name = name;
  user.password = password;
  user.phone = phone || '';
  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    token: generateToken(user._id)
  });
});

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Validate college email format
  if (!email.endsWith('@srmap.edu.in')) {
    res.status(401);
    throw new Error('Invalid email! Please use your SRM AP college email (@srmap.edu.in)');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('No account found with this email. Please register first');
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error('Email not verified. Please complete registration with OTP');
  }

  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Incorrect password. Please try again');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    token: generateToken(user._id)
  });
});

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  sendOTP,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};