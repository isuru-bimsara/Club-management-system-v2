const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getUsers,
  changeUserRole,
  banUser,
  unbanUser,
  getReports
} = require('../controllers/adminController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected Admin Routes
router.use(verifyToken, authorizeRole('admin', 'superadmin'));

router.get('/profile', getAdminProfile);
router.get('/users', getUsers);
router.put('/users/:id/role', changeUserRole);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.get('/reports', getReports);

module.exports = router;
