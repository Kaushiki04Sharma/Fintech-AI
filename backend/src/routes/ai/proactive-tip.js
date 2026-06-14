const express = require('express');
const auth = require('../../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDB } = require('../../mongoClient');

const router = express.Router();

let genAI = null;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } else {
    console.warn('GEMINI_API_KEY not set. AI features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Google AI:', error.message);
}

router.post('/proactive-tip', auth, async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ message: 'AI service is currently unavailable. Please check your API key configuration.' });
  }

  try {
    const db = getDB();
    const transactions = await db.collection('transactions')
      .find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(10)
      .toArray();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are FinWise, a proactive AI Financial Advisor. Based on the user's recent transactions, generate ONE concise, actionable financial tip to help them save money or optimize their spending. Keep it under 100 words and make it personalized.

      User's Recent Transactions: ${JSON.stringify(transactions, null, 2)}

      Tip:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tip = response.text().trim();

    res.json({ tip });

  } catch (error) {
    console.error('Proactive tip error:', error);
    console.error('Message:', error.message);
    console.error('Cause:', error.cause);
    res.status(500).json({ message: 'Failed to generate tip. Please try again.' });
  }
});

module.exports = router;
