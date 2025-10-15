import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const genAI = new GoogleGenerativeAI(config.googleGemini.apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Reverted model to gemini-pro

const getChatbotResponse = async (prompt) => {
  try {
    const result = await model.generateContentStream(prompt); // Changed to generateContentStream
    let text = '';
    for await (const chunk of result.stream) {
      text += chunk.text();
    }
    return text;
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw error;
  }
};

export { getChatbotResponse };
