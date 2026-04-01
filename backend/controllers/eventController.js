const mongoose = require('mongoose');
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Ticket = require('../models/Ticket');

const baseUrl = process.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

/** Admins, event creator, assigned presidentOf club, or Club document president. */
async function canManageEvent(user, event) {
  if (!user || !event) return false;
  if (user.role === 'admin' || user.role === 'superadmin') return true;

  const uid = user._id != null ? String(user._id) : '';
  if (event.createdBy != null && String(event.createdBy) === uid) return true;

  if (user.presidentOf && event.club.toString() === user.presidentOf.toString()) return true;

  const club = await Club.findById(event.club).select('president').lean();
  if (club?.president != null && String(club.president) === uid) return true;

  return false;
}

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/President
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venue, ticketPrice, totalTickets } = req.body;

    // Use club chosen in the form; fall back to presidentOf for older clients.
    const clubId = req.body.clubId || req.user.presidentOf;

    if (!clubId) {
      return res.status(403).json({ message: 'You must specify a club for this event' });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    let bannerImageUrl = '';
    if (req.file) {
      bannerImageUrl = `${baseUrl}/banners/${req.file.filename}`;
    }

    const created = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      bannerImage: bannerImageUrl,
      ticketPrice: Number(ticketPrice),
      totalTickets: Number(totalTickets),
      club: clubId,
      createdBy: req.user._id
    });

    const newEvent = await Event.findById(created._id).populate('club', 'clubName logo');

    // Notify club members
    if (club.members.length > 0) {
      const notifications = club.members.map(memberId => ({
        recipient: memberId,
        title: `New Event: ${title}`,
        message: `${club.clubName} has a new event on ${new Date(date).toLocaleDateString()}.`,
        type: 'event'
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 100);
    const skip = (page - 1) * limit;

    const andParts = [];

    if (req.query.search && String(req.query.search).trim()) {
      const s = String(req.query.search).trim();
      andParts.push({
        $or: [
          { title: { $regex: s, $options: 'i' } },
          { venue: { $regex: s, $options: 'i' } },
          { description: { $regex: s, $options: 'i' } },
        ],
      });
    }

    if (req.query.forPresident) {
      const pidRaw = String(req.query.forPresident).trim();
      if (!mongoose.Types.ObjectId.isValid(pidRaw)) {
        return res.status(400).json({ message: 'Invalid forPresident id' });
      }
      const userObjectId = new mongoose.Types.ObjectId(pidRaw);

      const clubIdsFromRole = await Club.find({ president: userObjectId }).distinct('_id');
      const userRow = await User.findById(userObjectId).select('presidentOf').lean();
      const fromProfile = userRow?.presidentOf ? [userRow.presidentOf] : [];
      const mergedClubIds = [
        ...new Set([...clubIdsFromRole, ...fromProfile].map((id) => String(id))),
      ].filter(Boolean);

      const scopeOr = [{ createdBy: userObjectId }];
      if (mergedClubIds.length) {
        scopeOr.push({
          club: { $in: mergedClubIds.map((id) => new mongoose.Types.ObjectId(id)) },
        });
      }
      andParts.push({ $or: scopeOr });
    }

    if (req.query.clubId) {
      andParts.push({ club: req.query.clubId });
    }

    const query =
      andParts.length === 0 ? {} : andParts.length === 1 ? andParts[0] : { $and: andParts };

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('club', 'clubName logo')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1, time: 1 }); // Ascending order

    res.json({
      data: events,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events for calendar
// @route   GET /api/events/calendar
// @access  Public
const getEventsForCalendar = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('club', 'clubName logo coverPhoto')
      .select('title date time venue status');

    // Format for FullCalendar or react-big-calendar
    const formattedEvents = events.map(event => {
      // Create proper start and end dates based on date and time
      const [hours, minutes] = event.time.split(':');
      const start = new Date(event.date);
      start.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // Default 4 hours later

      return {
        id: event._id,
        title: event.title,
        start,
        end,
        extendedProps: {
          venue: event.venue,
          clubName: event.club?.clubName,
          status: event.status,
          date: event.date,
          time: event.time
        }
      };
    });

    res.json(formattedEvents);
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'clubName logo description')
      .populate('createdBy', 'name');

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/President (own club only)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!(await canManageEvent(req.user, event))) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const { title, description, date, time, venue, ticketPrice, totalTickets } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (ticketPrice !== undefined) event.ticketPrice = Number(ticketPrice);
    if (totalTickets !== undefined) event.totalTickets = Number(totalTickets);

    if (req.file) {
      event.bannerImage = `${baseUrl}/banners/${req.file.filename}`;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/President (own club only)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!(await canManageEvent(req.user, event))) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Cascade: Delete tickets related to this event
    await Ticket.deleteMany({ event: event._id });

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventsForCalendar,
  getEventById,
  updateEvent,
  deleteEvent
};
