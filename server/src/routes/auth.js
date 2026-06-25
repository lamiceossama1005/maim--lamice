const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Name, email and password are required' });
  try {
    let u = await User.findOne({ email });
    if (u) return res.status(400).json({ msg: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    // Always enforce standard user role at registration time
    u = new User({ name, email, password: hash, role: 'user' });
    await u.save();
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } catch (err) { console.error('Register error:', err); res.status(500).json({ err: err.message }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });
  try {
    console.log('Login attempt for', email);
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ msg: 'Invalid email or password' });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid email or password' });
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } catch (err) { console.error('Login error:', err); res.status(500).json({ err: err.message }); }
});

// Get current authenticated user profile
router.get('/me', authenticate, async (req, res) => {
  // req.user is set by authenticate middleware and excludes password
  res.json(req.user);
});

module.exports = router;
