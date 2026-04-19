const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    reminderMinutes: {
      type: Number,
      default: 30,
      min: 0,
      max: 40320,
    },
    bannerImage: {
      type: String,
      default: '',
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    ticketsSold: {
      type: Number,
      default: 0,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

eventSchema.virtual('status').get(function() {
  const now = new Date();
  
  if (!this.date || !this.time) return 'upcoming';

  // Create a proper datetime object combining date and time
  const timeParts = this.time.split(':');
  const hours = timeParts[0] || 0;
  const minutes = timeParts[1] || 0;
  
  const eventDateTime = new Date(this.date);
  eventDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  
  // We'll consider an event "ongoing" for 4 hours after start
  const eventEndDateTime = new Date(eventDateTime.getTime() + 4 * 60 * 60 * 1000);

  if (now < eventDateTime) {
    return 'upcoming';
  } else if (now >= eventDateTime && now <= eventEndDateTime) {
    return 'ongoing';
  } else {
    return 'completed';
  }
});

module.exports = mongoose.model('Event', eventSchema);
