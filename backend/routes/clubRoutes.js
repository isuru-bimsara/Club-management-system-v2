const express = require('express');
const router = express.Router();
const {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  getClubMembers
} = require('../controllers/clubController');
const { verifyToken, authorizeRole, requirePresident } = require('../middleware/authMiddleware');
const { uploadClubImages, uploadLogo, uploadCover } = require('../middleware/uploadMiddleware');

// Public
router.get('/', getClubs);
router.get('/:id', getClubById);

// Admin
router.post('/', verifyToken, authorizeRole('admin'), uploadClubImages, createClub);
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteClub);

// Admin or President (put allows both, but logic handles permission)
router.put('/:id', verifyToken, uploadClubImages, updateClub);

// President or Admin
router.get('/:id/members', verifyToken, getClubMembers);

// Student
router.post('/:id/join', verifyToken, authorizeRole('student', 'president'), joinClub);
router.delete('/:id/leave', verifyToken, authorizeRole('student', 'president'), leaveClub);

module.exports = router;
