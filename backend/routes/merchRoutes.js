// // // // //backend/routes/merchRoutes.js
// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const { protect, presidentOnly } = require('../middleware/authMiddleware');
// // // // const multer = require('multer');
// // // // const path = require('path');

// // // // const storage = multer.diskStorage({
// // // //   destination: function (req, file, cb) {
// // // //     cb(null, path.join(__dirname, '../uploads'));
// // // //   },
// // // //   filename: function (req, file, cb) {
// // // //     cb(null, `${Date.now()}-${file.originalname}`);
// // // //   },
// // // // });
// // // // const upload = multer({ storage });

// // // // const ctrl = require('../controllers/merchandiseController');

// // // // // President CRUD
// // // // router.get('/president', protect, presidentOnly, ctrl.getMyMerchandise);
// // // // router.post('/president', protect, presidentOnly, upload.single('image'), ctrl.createMerchandise);
// // // // router.put('/president/:id', protect, presidentOnly, upload.single('image'), ctrl.updateMerchandise);
// // // // router.delete('/president/:id', protect, presidentOnly, ctrl.deleteMerchandise);
// // // // router.get('/president/orders', protect, presidentOnly, ctrl.getOrdersForPresident);
// // // // router.put('/president/orders/:id', protect, presidentOnly, ctrl.updateOrderStatus);

// // // // // Student flows
// // // // router.get('/event/:eventId', protect, ctrl.getEventMerch);
// // // // router.post('/order', protect, upload.single('receipt'), ctrl.placeOrder);
// // // // router.get('/orders/me', protect, ctrl.getMyOrders);

// // // // module.exports = router;


// // // const express = require('express');
// // // const router = express.Router();
// // // const { verifyToken, requirePresident, authorizeRole } = require('../middleware/authMiddleware');
// // // const { uploadReceipt, uploadBanner } = require('../middleware/uploadMiddleware'); // reuse existing multer config

// // // const ctrl = require('../controllers/merchandiseController');

// // // // President CRUD
// // // router.get('/president', verifyToken, authorizeRole('president'), ctrl.getMyMerchandise);
// // // router.post('/president', verifyToken, authorizeRole('president'), uploadBanner.single('image'), ctrl.createMerchandise);
// // // router.put('/president/:id', verifyToken, authorizeRole('president'), uploadBanner.single('image'), ctrl.updateMerchandise);
// // // router.delete('/president/:id', verifyToken, authorizeRole('president'), ctrl.deleteMerchandise);
// // // router.get('/president/orders', verifyToken, authorizeRole('president'), ctrl.getOrdersForPresident);
// // // router.put('/president/orders/:id', verifyToken, authorizeRole('president'), ctrl.updateOrderStatus);

// // // // Student flows
// // // router.get('/event/:eventId', verifyToken, ctrl.getEventMerch);
// // // router.post('/order', verifyToken, uploadReceipt.single('receipt'), ctrl.placeOrder);
// // // router.get('/orders/me', verifyToken, ctrl.getMyOrders);

// // // module.exports = router;

// // const express = require('express');
// // const router = express.Router();
// // const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
// // const { uploadBanner, uploadReceipt } = require('../middleware/uploadMiddleware');
// // const ctrl = require('../controllers/merchandiseController');

// // // President CRUD
// // router.get('/president', verifyToken, authorizeRole('president'), ctrl.getMyMerchandise);
// // router.post('/president', verifyToken, authorizeRole('president'), uploadBanner.single('bannerImage'), ctrl.createMerchandise);
// // router.put('/president/:id', verifyToken, authorizeRole('president'), uploadBanner.single('bannerImage'), ctrl.updateMerchandise);
// // router.delete('/president/:id', verifyToken, authorizeRole('president'), ctrl.deleteMerchandise);
// // router.get('/president/orders', verifyToken, authorizeRole('president'), ctrl.getOrdersForPresident);
// // router.put('/president/orders/:id', verifyToken, authorizeRole('president'), ctrl.updateOrderStatus);

// // // Student flows
// // router.get('/event/:eventId', verifyToken, ctrl.getEventMerch);
// // router.post('/order', verifyToken, uploadReceipt.single('receiptImage'), ctrl.placeOrder);
// // router.get('/orders/me', verifyToken, ctrl.getMyOrders);

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
// const { uploadMerchImage, uploadReceipt } = require('../middleware/uploadMiddleware');
// const ctrl = require('../controllers/merchandiseController');

// // President CRUD
// router.get('/president', verifyToken, authorizeRole('president'), ctrl.getMyMerchandise);
// router.post('/president', verifyToken, authorizeRole('president'), uploadMerchImage.single('merchImage'), ctrl.createMerchandise);
// router.put('/president/:id', verifyToken, authorizeRole('president'), uploadMerchImage.single('merchImage'), ctrl.updateMerchandise);
// router.delete('/president/:id', verifyToken, authorizeRole('president'), ctrl.deleteMerchandise);
// router.get('/president/orders', verifyToken, authorizeRole('president'), ctrl.getOrdersForPresident);
// router.put('/president/orders/:id', verifyToken, authorizeRole('president'), ctrl.updateOrderStatus);

// // Student flows
// router.get('/event/:eventId', verifyToken, ctrl.getEventMerch);
// router.post('/order', verifyToken, uploadReceipt.single('receiptImage'), ctrl.placeOrder);
// router.get('/orders/me', verifyToken, ctrl.getMyOrders);

// module.exports = router;

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