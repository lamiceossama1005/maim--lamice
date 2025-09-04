const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Event = require('../models/Event');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  // total revenue, tickets sold, attendees count
  const tickets = await Ticket.find();
  const revenue = tickets.reduce((s, t) => s + (t.price || 0), 0);
  const sold = tickets.length;
  const events = await Event.countDocuments();
  // simple demographics
  const users = await User.find();
  const byGender = users.reduce((acc, u) => { acc[u.gender || 'unknown'] = (acc[u.gender || 'unknown'] || 0) + 1; return acc }, {});
  res.json({ revenue, sold, events, byGender });
});

// Export basic tickets report as CSV
router.get('/export', authenticate, requireRole('admin'), async (req, res) => {
  const tickets = await Ticket.find().populate('event').populate('user');
  const rows = [
    ['ticketId', 'eventTitle', 'price', 'userEmail', 'checkedIn', 'createdAt']
  ];
  for (const t of tickets) {
    rows.push([
      String(t._id),
      t.event?.title || '',
      String(t.price || 0),
      t.user?.email || '',
      t.checkedIn ? 'true' : 'false',
      new Date(t.createdAt).toISOString()
    ]);
  }
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="tickets_report.csv"');
  res.send(csv);
});

module.exports = router;
