const express = require('express');
const router = express.Router();
const {
  purchaseTicket,
  getMyTickets,
  getClubTickets,
  approveTicket,
  rejectTicket
} = require('../controllers/ticketController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const { uploadReceipt } = require('../middleware/uploadMiddleware');

router.use(verifyToken);

// Student
router.post('/', authorizeRole('student', 'president', 'admin', 'superadmin'), uploadReceipt.single('receiptImage'), purchaseTicket);
router.get('/my', authorizeRole('student', 'president', 'admin', 'superadmin'), getMyTickets);

// President & Admin
router.get('/club/:clubId', authorizeRole('president', 'admin', 'superadmin'), getClubTickets);
router.put('/:id/approve', authorizeRole('president', 'admin', 'superadmin'), approveTicket);
router.put('/:id/reject', authorizeRole('president', 'admin', 'superadmin'), rejectTicket);

module.exports = router;
