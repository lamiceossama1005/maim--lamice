const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const qrcode = require('qrcode');
const { authenticate, requireRole } = require('../middleware/auth');

// Book ticket (user)
router.post('/book/:eventId', authenticate, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.eventId);
    if (!ev) return res.status(404).json({ msg: 'Event not found' });
    const { seatNumber } = req.body || {};
    let seat;
    if (seatNumber) {
      seat = ev.seats.find(s => s.seatNumber === String(seatNumber));
      if (!seat) return res.status(400).json({ msg: 'Invalid seat' });
      if (seat.booked) return res.status(400).json({ msg: 'Seat already booked' });
    } else {
      seat = ev.seats.find(s => !s.booked);
      if (!seat) return res.status(400).json({ msg: 'Sold out' });
    }
    seat.booked = true;
    const TicketModel = require('../models/Ticket');
    const ticket = new TicketModel({ user: req.user._id, event: ev._id, seatNumber: seat.seatNumber, price: ev.price });
    // generate QR containing ticket id
    const qr = await qrcode.toDataURL(JSON.stringify({ tid: ticket._id, eid: ev._id }));
    ticket.qrCodeDataUrl = qr;
    await ticket.save();
    seat.ticket = ticket._id;
    await ev.save();
    res.json(ticket);
  } catch (err) { res.status(500).json({ err: err.message }); }
});

// My tickets
router.get('/me', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
  const tickets = await Ticket.find({ user: req.user._id }).populate('event');
  res.json(tickets);
});

// Check-in (admin)
router.post('/checkin/:ticketId', authenticate, requireRole('admin'), async (req, res) => {
  const t = await Ticket.findById(req.params.ticketId);
  if (!t) return res.status(404).json({ msg: 'Not found' });
  t.checkedIn = true;
  await t.save();
  res.json({ ok: true });
});

module.exports = router;
