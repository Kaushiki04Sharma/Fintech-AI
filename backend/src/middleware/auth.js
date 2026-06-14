const jwt = require('jsonwebtoken');
const { getDB } = require('../mongoClient');
const { ObjectId } = require('mongodb');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      password: user.password
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;