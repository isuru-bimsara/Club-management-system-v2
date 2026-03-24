const mongoose = require('mongoose');
const Event = require('./Event');
const Ticket = require('./Ticket');
const Notification = require('./Notification');
const User = require('./User'); // Required for pre-remove hook

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    coverPhoto: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

clubSchema.virtual('memberCount').get(function() {
  return this.members ? this.members.length : 0;
});

// Avoid circular dependency in virtual populates for events if needed, but we'll count events instead
clubSchema.virtual('eventCount', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'club',
  count: true
});

// Cascade delete implementation
clubSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    const clubId = this._id;
    
    // Find all events for this club
    const events = await Event.find({ club: clubId });
    const eventIds = events.map(e => e._id);
    
    // Delete all tickets related to these events
    if (eventIds.length > 0) {
      await Ticket.deleteMany({ event: { $in: eventIds } });
    }
    
    // Delete all events for this club
    await Event.deleteMany({ club: clubId });
    
    // Update users: remove club from clubsJoined
    await User.updateMany(
      { clubsJoined: clubId },
      { $pull: { clubsJoined: clubId } }
    );
    
    // Clear presidentOf role
    if (this.president) {
      await User.findByIdAndUpdate(this.president, {
        $set: { role: 'student', presidentOf: null }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Club', clubSchema);
