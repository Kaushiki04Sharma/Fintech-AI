const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./mongoClient');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const goalRoutes = require('./routes/goals');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai'); // <-- Updated require statement
const proactiveTipRoutes = require('./routes/ai/proactive-tip');
const budgetReportRoutes = require('./routes/ai/budget-report');
const healthRoute = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // <-- REGISTER AUTH ROUTES
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/user', userRoutes); // <-- REGISTER USER ROUTES
app.use('/api/ai', aiRoutes);
app.use('/api/ai', proactiveTipRoutes);
app.use('/api/ai', budgetReportRoutes);
app.use('/api/health', healthRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// New async function to start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Successfully connected to MongoDB!');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to the database.');
    console.error(error);
    process.exit(1); // Exit if we can't connect to the DB
  }
};

// Start the server
startServer();

module.exports = app;