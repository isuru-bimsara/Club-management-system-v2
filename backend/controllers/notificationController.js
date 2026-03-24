const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get logged in user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments({ recipient: req.user._id });
    const notifications = await Notification.find({ recipient: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.json({
      data: notifications,
      unreadCount,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Broadcast message to all club members
// @route   POST /api/notifications/broadcast
// @access  Private/President
const broadcastMessage = async (req, res, next) => {
  try {
    const { title, message, clubId: reqClubId } = req.body;
    const clubId = (req.user.role === 'admin' || req.user.role === 'superadmin') ? reqClubId : req.user.presidentOf;

    if (!clubId) {
      return res.status(403).json({ message: 'You must specify a club to broadcast to' });
    }

    const clubMembers = await User.find({ clubsJoined: clubId }).select('_id');

    if (clubMembers.length === 0) {
      return res.status(400).json({ message: 'No members in the club to broadcast to' });
    }

    const notifications = clubMembers.map(member => ({
      recipient: member._id,
      title: title,
      message: message,
      type: 'broadcast'
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: `Broadcast sent to ${clubMembers.length} members` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  broadcastMessage
};
