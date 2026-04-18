const User = require('../models/User');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, studentId, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or student ID already exists' });
    }

    const user = await User.create({
      name,
      email,
      studentId,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        clubsJoined: user.clubsJoined,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user is an Admin
    const admin = await Admin.findOne({ email }).select('+password');
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          clubsJoined: [], // Admins might not be members in the same way, but keep it for consistency
        },
        token: generateToken(admin._id, admin.role),
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'banned') {
        return res.status(403).json({ message: 'Your account has been banned' });
      }

      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          profilePhoto: user.profilePhoto,
          clubsJoined: user.clubsJoined,
        },
        token: generateToken(user._id, user.role),
      });
    } 
    
    res.status(401).json({ message: 'Invalid email or password' });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('clubsJoined', 'clubName logo coverPhoto').select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.studentId = req.body.studentId || user.studentId;
      
      if (req.file) {
        user.profilePhoto = `${process.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads'}/logos/${req.file.filename}`;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto,
        clubsJoined: updatedUser.clubsJoined,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
};
