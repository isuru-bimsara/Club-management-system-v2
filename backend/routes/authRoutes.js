const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadProfile } = require('../middleware/uploadMiddleware');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, uploadProfile.single('profilePhoto'), updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
