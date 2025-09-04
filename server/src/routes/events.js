const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authenticate, requireRole } = require('../middleware/auth');

// Create event (admin)
router.post('/', authenticate, requireRole('admin'), async (req,res)=>{
  try{
    const { title, description, date, venue, price, totalSeats } = req.body;
    const seats = [];
    for(let i=1;i<=totalSeats;i++) seats.push({ seatNumber: String(i) });
    const ev = new Event({ title, description, date, venue, price, totalSeats, seats });
    await ev.save();
    res.json(ev);
  }catch(err){ res.status(500).json({ err: err.message }); }
});

// List events
router.get('/', async (req,res)=>{
  const q = req.query.q || '';
  const events = await Event.find({ title: { $regex: q, $options: 'i' } }).sort({ date: 1 });
  res.json(events);
});

// Get single
router.get('/:id', async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  if(!ev) return res.status(404).json({ msg: 'Not found' });
  res.json(ev);
});

// Update (admin)
router.put('/:id', authenticate, requireRole('admin'), async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  if(!ev) return res.status(404).json({ msg: 'Not found' });
  Object.assign(ev, req.body);
  await ev.save();
  res.json(ev);
});

// Delete
router.delete('/:id', authenticate, requireRole('admin'), async (req,res)=>{
  await Event.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
