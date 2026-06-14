const express = require('express');
const { getDB } = require('../mongoClient');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', auth, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.name } });
});

module.exports = router;

// Get or update user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ emailNotifications: user.emailNotifications, pushNotifications: user.pushNotifications });
  } catch (error) {
    console.error('[GET PREFERENCES ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/preferences', auth, async (req, res) => {
  try {
    const { emailNotifications, pushNotifications } = req.body;
    const updateData = {};
    if (typeof emailNotifications === 'boolean') updateData.emailNotifications = emailNotifications;
    if (typeof pushNotifications === 'boolean') updateData.pushNotifications = pushNotifications;

    const db = getDB();
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: updateData }
    );
    
    const updated = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    res.json({ emailNotifications: updated.emailNotifications, pushNotifications: updated.pushNotifications });
  } catch (error) {
    console.error('[UPDATE PREFERENCES ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
