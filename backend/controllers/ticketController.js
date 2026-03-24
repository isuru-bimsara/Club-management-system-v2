const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const generateETicket = require('../utils/generateETicket');
const sendEmail = require('../utils/sendEmail');

const baseUrl = process.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

// @desc    Purchase a ticket
// @route   POST /api/tickets
// @access  Private/Student
const purchaseTicket = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const qty = Number(quantity);
    if (qty < 1 || qty > 5) {
      return res.status(400).json({ message: 'Quantity must be between 1 and 5' });
    }

    if (event.ticketsSold + qty > event.totalTickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    let receiptImageUrl = '';
    if (req.file) {
      receiptImageUrl = `${baseUrl}/receipts/${req.file.filename}`;
    } else if (event.ticketPrice > 0) {
      return res.status(400).json({ message: 'Payment receipt is required for paid events' });
    }

    const totalAmount = event.ticketPrice * qty;

    const ticket = await Ticket.create({
      student: studentId,
      event: eventId,
      quantity: qty,
      totalAmount,
      receiptImage: receiptImageUrl || 'free_event',
      status: 'pending'
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's tickets
// @route   GET /api/tickets/my
// @access  Private/Student
const getMyTickets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { student: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .populate({
        path: 'event',
        select: 'title date time venue bannerImage club',
        populate: { path: 'club', select: 'clubName logo' }
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: tickets,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets for a club's events
// @route   GET /api/tickets/club/:clubId
// @access  Private/President (own club only)
const getClubTickets = async (req, res, next) => {
  try {
    if (req.user.role === 'president') {
      const isAuthorized = req.user.presidentOf && req.user.presidentOf.toString() === req.params.clubId;
      if (!isAuthorized) {
        const Club = require('../models/Club');
        const club = await Club.findById(req.params.clubId);
        if (!club || club.president.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to view tickets for this club' });
        }
      }
    }

    const events = await Event.find({ club: req.params.clubId }).select('_id');
    const eventIds = events.map(e => e._id);

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { event: { $in: eventIds } };
    if (req.query.status) query.status = req.query.status;
    if (req.query.eventId) query.event = req.query.eventId;

    // We need to populate student to search by name/email if requested
    let tickets = await Ticket.find(query)
      .populate('student', 'name email studentId')
      .populate('event', 'title date')
      .sort({ createdAt: -1 });

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      tickets = tickets.filter(t => 
        (t.student && searchRegex.test(t.student.name)) || 
        (t.student && searchRegex.test(t.student.email)) ||
        (t.student && searchRegex.test(t.student.studentId))
      );
    }

    const total = tickets.length;
    tickets = tickets.slice(skip, skip + limit);

    res.json({
      data: tickets,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a ticket
// @route   PUT /api/tickets/:id/approve
// @access  Private/President
const approveTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', 'name email')
      .populate('event', 'title date venue club');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status !== 'pending') {
      return res.status(400).json({ message: `Ticket is already ${ticket.status}` });
    }

    const event = ticket.event;
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      const isAuthorized = req.user.presidentOf && event.club.toString() === req.user.presidentOf.toString();
      if (!isAuthorized) {
        const Club = require('../models/Club');
        const club = await Club.findById(event.club);
        if (!club || club.president.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized' });
        }
      }
    }

    const realEventRecord = await Event.findById(event._id);
    if (realEventRecord.ticketsSold + ticket.quantity > realEventRecord.totalTickets) {
      return res.status(400).json({ message: 'Not enough tickets left. Cannot approve.' });
    }

    // Generate e-ticket
    const { eTicketCode, qrCodeImage } = await generateETicket();
    
    ticket.status = 'approved';
    ticket.eTicketCode = eTicketCode;
    ticket.qrCodeImage = qrCodeImage;
    await ticket.save();

    // Increment event sold count
    realEventRecord.ticketsSold += ticket.quantity;
    await realEventRecord.save();

    // Create Notification
    if (ticket.student) {
      await Notification.create({
        recipient: ticket.student._id,
        title: 'Ticket Approved!',
        message: `Your ticket for ${event.title} has been approved.`,
        type: 'ticket'
      });
    }

    // Send Email
    if (ticket.student && ticket.student.email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">SLIIT Events</h2>
          <h3 style="text-align: center;">Your E-Ticket for ${event.title}</h3>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <div style="margin-bottom: 20px;">
            <p><strong>Hi ${ticket.student.name},</strong></p>
            <p>Your payment has been verified and your ticket is approved. Here are your event details:</p>
            <ul>
              <li><strong>Event:</strong> ${event.title}</li>
              <li><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</li>
              <li><strong>Venue:</strong> ${event.venue}</li>
              <li><strong>Quantity:</strong> ${ticket.quantity}</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <img src="${qrCodeImage}" alt="QR Code" style="width: 200px; height: 200px;" />
            <p><strong>Ticket Code:</strong> ${eTicketCode}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="text-align: center; color: #64748b; font-size: 14px;">Show this QR code at the venue entry.</p>
        </div>
      `;

      try {
        await sendEmail({
          email: ticket.student.email,
          subject: `Your E-Ticket for ${event.title} — SLIIT Events`,
          html: emailHtml
        });
      } catch (emailError) {
        console.error('Email could not be sent', emailError);
        // We don't fail the request if email fails, but log it
      }
    }

    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a ticket
// @route   PUT /api/tickets/:id/reject
// @access  Private/President
const rejectTicket = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', '_id')
      .populate('event', 'title club');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status !== 'pending') {
      return res.status(400).json({ message: `Ticket is already ${ticket.status}` });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      const isAuthorized = req.user.presidentOf && ticket.event.club.toString() === req.user.presidentOf.toString();
      if (!isAuthorized) {
        const Club = require('../models/Club');
        const club = await Club.findById(ticket.event.club);
        if (!club || club.president.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized' });
        }
      }
    }

    ticket.status = 'rejected';
    ticket.rejectionReason = rejectionReason || 'Payment verification failed';
    await ticket.save();

    // Create Notification
    if (ticket.student) {
      await Notification.create({
        recipient: ticket.student._id,
        title: 'Ticket Rejected',
        message: `Your ticket for ${ticket.event?.title || 'an event'} was rejected. Reason: ${ticket.rejectionReason}`,
        type: 'ticket'
      });
    }

    res.json({ message: 'Ticket rejected successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  purchaseTicket,
  getMyTickets,
  getClubTickets,
  approveTicket,
  rejectTicket
};
