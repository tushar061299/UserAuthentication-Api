
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
  try {
    // Check if the user is an admin
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = { userId: user._id, role: 'admin' };
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.isAuthorized = (req, res, next) => {
  try {
    // Get the JWT token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    // Check if the token is in the blacklist
    const blacklist = JSON.parse(process.env.TOKEN_BLACKLIST || '[]');
    if (blacklist.includes(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};