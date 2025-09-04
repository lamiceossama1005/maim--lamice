const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: String,
  booked: { type: Boolean, default: false },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
});

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  venue: String,
  price: Number,
  totalSeats: Number,
  seats: [seatSchema],
  status: { type: String, enum: ['upcoming','active','closed'], default: 'upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
