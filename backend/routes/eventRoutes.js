const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventsForCalendar,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { verifyToken, authorizeRole, requirePresident } = require('../middleware/authMiddleware');
const { uploadBanner } = require('../middleware/uploadMiddleware');

// Public
router.get('/', getEvents);
router.get('/calendar', getEventsForCalendar);
router.get('/:id', getEventById);

// Protected (President only for modify operations)
router.post('/', verifyToken, authorizeRole('president', 'admin', 'superadmin'), uploadBanner.single('bannerImage'), createEvent);
router.put('/:id', verifyToken, authorizeRole('president', 'admin', 'superadmin'), uploadBanner.single('bannerImage'), updateEvent);
router.delete('/:id', verifyToken, authorizeRole('president', 'admin', 'superadmin'), deleteEvent);

module.exports = router;
