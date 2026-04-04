const Admin = require('../models/Admin');
const User = require('../models/User');
const Club = require('../models/Club');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const generateToken = require('../utils/generateToken');

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public (in real app, should be protected)
const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user._id);

    if (admin) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with pagination, filtering, searching
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.role) query.role = req.query.role;
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { studentId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const changeUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { role } = req.body;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!['student', 'president', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Don't allow changing superadmin roles if req.user is an admin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify superadmin' });
    }

    user.role = role;
    
    // Clear presidentOf if no longer a president
    if (role !== 'president' && user.presidentOf) {
      user.presidentOf = null;
    }

    const updatedUser = await user.save();
    
    // Send updated user back safely
    const safeUser = updatedUser.toObject();
    delete safeUser.password;

    res.json({ message: 'User role updated successfully', user: safeUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = 'banned';
      await user.save();
      res.json({ message: 'User banned successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Unban user
// @route   PUT /api/admin/users/:id/unban
// @access  Private/Admin
const unbanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Revert to active status
      user.status = 'active';
      await user.save();
      res.json({ message: 'User unbanned successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get system reports data
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res, next) => {
  try {
    // Total revenue by club (approved tickets only)
    const revenueByClub = await Ticket.aggregate([
      { $match: { status: 'approved' } },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventDetails'
        }
      },
      { $unwind: '$eventDetails' },
      {
        $lookup: {
          from: 'clubs',
          localField: 'eventDetails.club',
          foreignField: '_id',
          as: 'clubDetails'
        }
      },
      { $unwind: '$clubDetails' },
      {
        $group: {
          _id: '$clubDetails.clubName',
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Event attendance by month
    const attendanceByMonth = await Ticket.aggregate([
      { $match: { status: 'approved' } },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventDetails'
        }
      },
      { $unwind: '$eventDetails' },
      {
        $group: {
          _id: {
            month: { $month: '$eventDetails.date' },
            year: { $year: '$eventDetails.date' }
          },
          totalAttendance: { $sum: '$quantity' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top clubs by membership
    const topClubs = await Club.aggregate([
      {
        $project: {
          clubName: 1,
          memberCount: { $size: { $ifNull: ['$members', []] } }
        }
      },
      { $sort: { memberCount: -1 } },
      { $limit: 5 }
    ]);

    // Summary stats
    const totalClubs = await Club.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEvents = await Event.countDocuments();
    
    const revenueSumResult = await Ticket.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueSumResult.length > 0 ? revenueSumResult[0].total : 0;

    res.json({
      revenueByClub,
      attendanceByMonth,
      topClubs,
      summary: {
        totalClubs,
        totalStudents,
        totalEvents,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getUsers,
  changeUserRole,
  banUser,
  unbanUser,
  getReports
};
