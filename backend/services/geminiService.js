import config from '../config/config.js';
import fetch from 'node-fetch';
import fs from 'fs';

const GEMINI_API_KEY = config.googleGemini.apiKey || process.env.GEMINI_API_KEY;

// List of preferred Gemini models to try (in fallback order)
const PRIMARY_MODELS = [
  'models/gemini-2.5-flash',
  'models/gemini-1.5-flash-latest',
  'models/gemini-1.0-pro-latest',
];

/**
 * Get AI response from Gemini API for chatbot interactions.
 * @param {string} prompt - User input or message.
 * @param {string} userName - Patient or user name.
 * @param {string} language - Language preference ('en' or 'hi').
 * @param {string} uploadedFilePath - Optional file path for a medical report.
 * @returns {Promise<string>} AI-generated response.
 */
export const getChatbotResponse = async (prompt, userName, language, uploadedFilePath) => {
  if (!GEMINI_API_KEY) {
    return "Assistant connection issue. Please try again later.";
  }

  const patientName = userName || 'User';
  const isHindi = (language || '').toLowerCase() === 'hi';

  // Define tone and context for the assistant
  const tone = isHindi
    ? `You are HealthSphere’s friendly and helpful patient assistant.
       Talk to the patient by their name (${patientName}) and clearly answer all health-related queries.
       End each response with: "Main 100% sahi nahi ho sakta, kripya doctor se consult kare."`
    : `You are HealthSphere’s friendly and helpful patient assistant.
       Always address the patient by their name (${patientName}) and clearly answer all health-related queries.
       End each response with: "I'm not 100% accurate, please consult a doctor for confirmation."`;

  // Include file note if a report was uploaded
  let reportNote = '';
  if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
    reportNote = `\nA medical report has been uploaded at: ${uploadedFilePath}.
      Analyze its contents and answer any related questions from the user.`;
  }

  // Final input for Gemini
  const finalPrompt = `${tone}\nUser: ${prompt || ''}${reportNote}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
  };

  // Try all models and API versions in sequence
  for (const model of PRIMARY_MODELS) {
    for (const version of ['v1beta', 'v1']) {
      try {
        const url = `https://generativelanguage.googleapis.com/${version}/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.();

        if (text) return text;
      } catch (error) {
        console.error(`Gemini model error [${model}]:`, error.message);
        continue;
      }
    }
  }

  return "Sorry, I'm unable to respond right now. Please try again later.";
};
