import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Initialization ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not defined in the .env file");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

export const runHelpChat = async (message) => {
  if (!model) {
    throw new Error("Gemini API is not configured");
  }

  try {
    const prompt = `
      You are a helpful assistant for FinWise, a personal finance app. Answer questions about how to use the app, its features, and general finance tips. Keep answers concise and clear.
      
      User question: "${message}"
      
      Response:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in Help Gemini API call:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

export const runFinancialChat = async (
  message,
  transactions = [],
  goals = [],
  userName = "User"
) => {
  if (!model) {
    throw new Error("Gemini API is not configured");
  }

  try {
    const prompt = `
      You are FinWise, an expert AI Financial Coach. Your tone is helpful, encouraging, and professional.
      - Never give prescriptive financial advice (e.g., "buy this stock"). Instead, provide analysis based on general knowledge.
      - Keep answers helpful, concise, and easy to understand.
      - If the question is not related to finance, politely decline to answer.

      USER'S FINANCIAL CONTEXT:
      - Name: ${userName}
      - Recent Transactions: ${JSON.stringify(transactions.slice(0, 20), null, 2)}
      - Financial Goals: ${JSON.stringify(goals, null, 2)}

      USER'S QUESTION:
      "${message}"

      Your Response:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in Financial Gemini API call:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};
