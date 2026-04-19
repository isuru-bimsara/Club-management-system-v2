const Event = require('../models/Event');
const Club = require('../models/Club');
const Notification = require('../models/Notification');
const Ticket = require('../models/Ticket');

const baseUrl = process.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/President
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venue, ticketPrice, totalTickets, reminderMinutes } = req.body;
    const clubId = (req.user.role === 'admin' || req.user.role === 'superadmin') ? req.body.clubId : req.user.presidentOf;

    if (!clubId) {
      return res.status(403).json({ message: 'You must specify a club for this event' });
    }

    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return res.status(400).json({ message: 'Event date cannot be in the past' });
    }

    let bannerImageUrl = '';
    if (req.file) {
      bannerImageUrl = `${baseUrl}/banners/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      reminderMinutes: Number(reminderMinutes ?? 30),
      bannerImage: bannerImageUrl,
      ticketPrice: Number(ticketPrice),
      totalTickets: Number(totalTickets),
      club: clubId,
      createdBy: req.user._id
    });

    // Notify club members
    const club = await Club.findById(clubId);
    if (club && club.members.length > 0) {
      const notifications = club.members.map(memberId => ({
        recipient: memberId,
        title: `New Event: ${title}`,
        message: `${club.clubName} has a new event on ${new Date(date).toLocaleDateString()}.`,
        type: 'event'
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json(event);
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
    const limit = parseInt(req.query.limit, 10) || 8;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { venue: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.clubId) {
      query.club = req.query.clubId;
    }

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
      .select('title description date time venue reminderMinutes status');

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
          description: event.description,
          venue: event.venue,
          clubName: event.club?.clubName,
          status: event.status,
          date: event.date,
          time: event.time,
          reminderMinutes: event.reminderMinutes
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

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      const isAuthorized = req.user.presidentOf && event.club.toString() === req.user.presidentOf.toString();
      if (!isAuthorized) {
        const Club = require('../models/Club');
        const club = await Club.findById(event.club);
        if (!club || club.president.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to update this event' });
        }
      }
    }

    const { title, description, date, time, venue, ticketPrice, totalTickets, reminderMinutes } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) {
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Only validate if date is actually changing to a new value
      if (date !== event.date.toISOString().split('T')[0] && eventDate < today) {
        return res.status(400).json({ message: 'Event date cannot be in the past' });
      }
      event.date = date;
    }
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (reminderMinutes !== undefined) event.reminderMinutes = Number(reminderMinutes);
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

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      const isAuthorized = req.user.presidentOf && event.club.toString() === req.user.presidentOf.toString();
      if (!isAuthorized) {
        const Club = require('../models/Club');
        const club = await Club.findById(event.club);
        if (!club || club.president.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to delete this event' });
        }
      }
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
