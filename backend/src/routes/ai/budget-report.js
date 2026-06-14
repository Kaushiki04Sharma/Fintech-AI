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

router.post('/budget-report', auth, async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ message: 'AI service is currently unavailable. Please check your API key configuration.' });
  }

  try {
    const db = getDB();
    const transactions = await db.collection('transactions')
      .find({ userId: req.user.id })
      .sort({ date: -1 })
      .toArray();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are FinWise, an AI Budget Analyst. Analyze the user's transactions and provide a 50/30/20 budget breakdown (50% Needs, 30% Wants, 20% Savings/Debt).

      Respond ONLY with valid JSON in this exact format:
      {
        "data": [
          {"category": "Needs", "percentage": 50, "amount": 0},
          {"category": "Wants", "percentage": 30, "amount": 0},
          {"category": "Savings/Debt", "percentage": 20, "amount": 0}
        ],
        "summary": "Brief summary string",
        "explanation": "Detailed explanation string"
      }

      User's Transactions: ${JSON.stringify(transactions, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse and validate JSON
    const report = JSON.parse(text);
    res.json(report);

  } catch (error) {
    console.error('Budget report error:', error);
    console.error('Message:', error.message);
    console.error('Cause:', error.cause);
    res.status(500).json({ message: 'Failed to generate budget report. Please try again.' });
  }
});

module.exports = router;
