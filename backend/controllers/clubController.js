const Club = require('../models/Club');
const User = require('../models/User');
const Notification = require('../models/Notification');

const baseUrl = process.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Private/Admin
const createClub = async (req, res, next) => {
  try {
    const { clubName, description, president } = req.body;
    
    // Validation: Only letters and spaces allowed
    const clubNameRegex = /^[a-zA-Z\s]+$/;
    if (clubName && !clubNameRegex.test(clubName)) {
      return res.status(400).json({ message: 'Club name can only contain letters and spaces' });
    }

    const clubExists = await Club.findOne({ clubName });
    if (clubExists) {
      return res.status(400).json({ message: 'Club name already exists' });
    }

    const presidentUser = await User.findById(president);
    if (!presidentUser) {
      return res.status(404).json({ message: 'President user not found' });
    }
    
    if (presidentUser.role === 'president') {
      return res.status(400).json({ message: 'User is already a president of a club' });
    }

    let logoUrl = '';
    let coverPhotoUrl = '';

    if (req.files) {
      if (req.files.logo) logoUrl = `${baseUrl}/logos/${req.files.logo[0].filename}`;
      if (req.files.coverPhoto) coverPhotoUrl = `${baseUrl}/covers/${req.files.coverPhoto[0].filename}`;
    }

    const club = await Club.create({
      clubName,
      description,
      president,
      logo: logoUrl,
      coverPhoto: coverPhotoUrl,
      members: [president]
    });

    // Update user role to president and assign presidentOf
    presidentUser.role = 'president';
    presidentUser.presidentOf = club._id;
    if (!presidentUser.clubsJoined.includes(club._id)) {
      presidentUser.clubsJoined.push(club._id);
    }
    await presidentUser.save();

    // Create Notification
    await Notification.create({
      recipient: presidentUser._id,
      title: 'You\'ve been assigned as President',
      message: `You are now the president of ${club.clubName}.`,
      type: 'club'
    });

    res.status(201).json(club);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.clubName = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.presidentId) {
      query.president = req.query.presidentId;
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === 'members') sort = { memberCount: -1 };

    const total = await Club.countDocuments(query);
    const clubs = await Club.find(query)
      .populate('president', 'name email')
      .populate('eventCount')
      .skip(skip)
      .limit(limit)
      .sort(sort);

    res.json({
      data: clubs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('president', 'name email profilePhoto')
      .populate('eventCount');

    if (club) {
      res.json(club);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private/Admin or Private/President (own club)
const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Role-based authorization
    if (req.user.role === 'president' && req.user.presidentOf.toString() !== club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this club' });
    }

    const { clubName, description, president } = req.body;

    if (clubName) {
      // Validation: Only letters and spaces allowed
      const clubNameRegex = /^[a-zA-Z\s]+$/;
      if (!clubNameRegex.test(clubName)) {
        return res.status(400).json({ message: 'Club name can only contain letters and spaces' });
      }
      club.clubName = clubName;
    }
    if (description) club.description = description;

    // Handle image uploads
    if (req.files) {
      if (req.files.logo) club.logo = `${baseUrl}/logos/${req.files.logo[0].filename}`;
      if (req.files.coverPhoto) club.coverPhoto = `${baseUrl}/covers/${req.files.coverPhoto[0].filename}`;
    } else if (req.file && req.user.role === 'president') {
      // If uploading individually
      if (req.file.fieldname === 'logo') club.logo = `${baseUrl}/logos/${req.file.filename}`;
      if (req.file.fieldname === 'coverPhoto') club.coverPhoto = `${baseUrl}/covers/${req.file.filename}`;
    }

    // Handle president reassignment (Admin only)
    if (president && req.user.role === 'admin' && president !== club.president.toString()) {
      const oldPresident = await User.findById(club.president);
      if (oldPresident) {
        oldPresident.role = 'student';
        oldPresident.presidentOf = null;
        await oldPresident.save();
      }

      const newPresident = await User.findById(president);
      if (newPresident) {
        newPresident.role = 'president';
        newPresident.presidentOf = club._id;
        if (!newPresident.clubsJoined.includes(club._id)) {
          newPresident.clubsJoined.push(club._id);
        }
        await newPresident.save();
        club.president = president;

        await Notification.create({
          recipient: newPresident._id,
          title: 'You\'ve been assigned as President',
          message: `You are now the president of ${club.clubName}.`,
          type: 'club'
        });
      }
    }

    const updatedClub = await club.save();
    res.json(updatedClub);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private/Admin
const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (club) {
      await club.deleteOne();
      res.json({ message: 'Club removed' });
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Student joins club
// @route   POST /api/clubs/:id/join
// @access  Private/Student
const joinClub = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const userId = req.user._id;

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    if (club.members.includes(userId)) {
      return res.status(400).json({ message: 'You have already joined this club' });
    }

    club.members.push(userId);
    await club.save();

    const user = await User.findById(userId);
    if (!user.clubsJoined.includes(clubId)) {
      user.clubsJoined.push(clubId);
      await user.save();
    }

    res.json({ message: 'Joined club successfully', clubId });
  } catch (error) {
    next(error);
  }
};

// @desc    Student leaves club
// @route   DELETE /api/clubs/:id/leave
// @access  Private/Student
const leaveClub = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const userId = req.user._id;

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    if (club.president.toString() === userId.toString()) {
      return res.status(400).json({ message: 'President cannot leave the club' });
    }

    club.members = club.members.filter(m => m.toString() !== userId.toString());
    await club.save();

    const user = await User.findById(userId);
    user.clubsJoined = user.clubsJoined.filter(c => c.toString() !== clubId.toString());
    await user.save();

    res.json({ message: 'Left club successfully', clubId });
  } catch (error) {
    next(error);
  }
};

// @desc    Get club members
// @route   GET /api/clubs/:id/members
// @access  Private (Admin or President)
const getClubMembers = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const club = await Club.findById(clubId).populate({
      path: 'members',
      select: 'name email studentId profilePhoto role createdAt status',
      options: { skip, limit }
    });

    if (!club) return res.status(404).json({ message: 'Club not found' });

    const total = club.members.length > 0 ? await Club.findById(clubId).then(c => c.members.length) : 0;

    res.json({
      data: club.members,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  getClubMembers
};
