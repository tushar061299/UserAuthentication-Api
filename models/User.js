const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, default: 'default-avatar.jpg' },
  bio: { type: String },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  isPublic: { type: String, enum: ['public', 'private'], default: 'public'  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;