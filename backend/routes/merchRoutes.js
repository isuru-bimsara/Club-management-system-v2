const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const { uploadMerchImage, uploadReceipt } = require('../middleware/uploadMiddleware');
const ctrl = require('../controllers/merchandiseController');

// President CRUD
router.get('/president', verifyToken, authorizeRole('president'), ctrl.getMyMerchandise);
router.post('/president', verifyToken, authorizeRole('president'), uploadMerchImage.single('merchImage'), ctrl.createMerchandise);
router.put('/president/:id', verifyToken, authorizeRole('president'), uploadMerchImage.single('merchImage'), ctrl.updateMerchandise);
router.delete('/president/:id', verifyToken, authorizeRole('president'), ctrl.deleteMerchandise);
router.get('/president/orders', verifyToken, authorizeRole('president', 'admin', 'superadmin'), ctrl.getOrdersForPresident);
router.put('/president/orders/:id', verifyToken, authorizeRole('president', 'admin', 'superadmin'), ctrl.updateOrderStatus);

// Student flows
router.get('/event/:eventId', verifyToken, ctrl.getEventMerch);
router.post('/order', verifyToken, uploadReceipt.single('receiptImage'), ctrl.placeOrder);
router.get('/orders/me', verifyToken, ctrl.getMyOrders);

module.exports = router;