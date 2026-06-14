const express = require('express');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDB } = require('../mongoClient');

const router = express.Router();

// Initialize Google AI with error handling
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

router.post('/chat', auth, async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ message: 'AI service is currently unavailable. Please check your API key configuration.' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    const db = getDB();
    const [transactions, goals] = await Promise.all([
      db.collection('transactions').find({ userId: req.user.id }).sort({ date: -1 }).limit(20).toArray(),
      db.collection('goals').find({ userId: req.user.id }).toArray(),
    ]);

    // Use a powerful model for complex advice
    const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

    // --- ENHANCED SYSTEM PROMPT ---
    const prompt = `
      You are FinWise, a **High-Level AI Financial Growth Advisor**. Your goal is to help the user grow their money, optimize their spending, and suggest personalized investment strategies.
      Your tone must be highly professional, strategic, and encouraging.

      **Instructions for Analysis and Response:**
      1. **Analyze Data:** Thoroughly examine the provided 'USER'S FINANCIAL CONTEXT' (transactions and goals) to form a personalized plan.
      2. **Money Utilization & Savings:** Advise the user on how they can better utilize their money, optimize their budget (e.g., target high-spend categories), and find new savings opportunities based on their recent transactions.
      3. **Investment Approach:** Suggest general types of investment strategies (e.g., diversified portfolio, retirement accounts, risk analysis) that align with their current goals and financial activity. **NEVER recommend specific stocks, funds, or products.**
      4. **Financial Growth Plan:** Provide a clear, strategic approach for their financial growth.
      5. **Relevance:** If a question is entirely unrelated to personal finance or the site, politely decline and maintain your role as a Financial Growth Advisor.

      USER'S FINANCIAL CONTEXT:
      - Name: ${req.user.name}
      - Recent Transactions: ${JSON.stringify(transactions, null, 2)}
      - Financial Goals: ${JSON.stringify(goals, null, 2)}

      USER'S QUESTION:
      "${message}"

      YOUR RESPONSE:
    `;

    console.log("--- Sending Strategic Financial Query to Gemini ---");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("--- Received Response from Gemini ---");

    res.json({ reply: text });

  } catch (error) {
    console.error('--- AI CHAT ERROR ---');
    console.error('Error details:', error.message);
    console.error('Full error:', error);

    // NOTE: Keep the original error message for the backend for debugging
    res.status(500).json({ message: 'Failed to get a response. Please try again later or check your API key.' });
  }
});

module.exports = router;