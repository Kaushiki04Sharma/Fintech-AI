const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../mongoClient');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');

const router = express.Router();

// ADD: Register
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDB();
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      email,
      name,
      password: hashed,
      emailNotifications: true,
      pushNotifications: true,
      createdAt: new Date()
    });

    const token = jwt.sign({ id: result.insertedId.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Don't return password
    res.status(201).json({ user: { id: result.insertedId.toString(), email, name } });
  } catch (error) {
    console.error('[REGISTER ERROR]:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const db = getDB();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ user: { id: user._id.toString(), email: user.email, name: user.name } });
  } catch (error) {
    console.error("[LOGIN ERROR]:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ADD: Logout
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Logged out' });
  } catch (error) {
    console.error('[LOGOUT ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password (authenticated)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    // req.user is set by auth middleware
    const isValid = await bcrypt.compare(currentPassword, req.user.password || '');
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const db = getDB();
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { password: hashed } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('[CHANGE PASSWORD ERROR]:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

module.exports = router;
