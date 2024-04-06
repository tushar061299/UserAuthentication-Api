const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // Register new user
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Login user
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginSocial = async (req, res) => {
    try {
        // Get the user's profile information from the social media platform
        const { id, displayName, photos, emails } = req.user;
    
        // Find or create the user in the database
        let user = await User.findOne({ 'social.id': id });
        if (!user) {
          user = new User({
            name: displayName,
            email: emails[0].value,
            photo: photos[0].value,
            'social.id': id,
            'social.provider': req.authInfo.provider
          });
          await user.save();
        }
    
        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
};

exports.logout = (req, res) => {
    try {
        // Get the JWT token from the request headers
        const token = req.headers.authorization.split(' ')[1];
    
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: 'Invalid token' });
          }
    
          // Revoke the token by adding it to a blacklist
          // This ensures that the token can no longer be used for authentication
          const blacklist = JSON.parse(process.env.TOKEN_BLACKLIST || '[]');
          blacklist.push(token);
          process.env.TOKEN_BLACKLIST = JSON.stringify(blacklist);
    
          res.json({ message: 'Logged out successfully' });
        });
      } catch (err) {
        res.status(400).json({ message: err.message });
    }
}



