const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  broadcastMessage
} = require('../controllers/notificationController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.post('/broadcast', authorizeRole('president', 'admin', 'superadmin'), broadcastMessage);

module.exports = router;
