const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await User.findById(payload.id).select('-password');
    if (!req.user) return res.status(401).json({ msg: 'Invalid user' });
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
  if (req.user.role !== role) return res.status(403).json({ msg: 'Forbidden' });
  next();
}
