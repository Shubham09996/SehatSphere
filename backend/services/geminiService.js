import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pdfParse = require('pdf-parse'); // ✅ Fixed import
import config from '../config/config.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';

const GEMINI_API_KEY = config.googleGemini.apiKey || process.env.GEMINI_API_KEY;

// Gemini models list
const PRIMARY_MODELS = [
  'models/gemini-2.5-flash',
  'models/gemini-1.5-flash-latest',
  'models/gemini-1.0-pro-latest',
];

export const getChatbotResponse = async (prompt, userName, language, uploadedFilePath = null) => {
  if (!GEMINI_API_KEY) {
    return "Assistant connection issue. Please try again later.";
  }

  const patientName = userName || 'User';
  const isHindi = (language || '').toLowerCase() === 'hi';

  let extractedText = '';

  try {
    // 🔍 Step 1: File handling
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      const ext = path.extname(uploadedFilePath).toLowerCase();

      if (ext === '.pdf') {
        const pdfData = await pdfParse(fs.readFileSync(uploadedFilePath));
        extractedText = pdfData.text;
        console.log('📄 PDF text extracted successfully');
      } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const result = await Tesseract.recognize(uploadedFilePath, 'eng');
        extractedText = result.data.text;
        console.log('🖼️ Image OCR extracted successfully');
      }
    }

    // 🧠 Step 2: Create prompt
    const tone = isHindi
      ? `You are HealthSphere’s friendly and helpful patient assistant.
         Talk to the patient by their name (${patientName}) and clearly answer all health-related queries.
         End each response with: "Main 100% sahi nahi ho sakta, kripya doctor se consult kare."`
      : `You are HealthSphere’s friendly and helpful patient assistant.
         Always address the patient by their name (${patientName}) and clearly answer all health-related queries.
         End each response with: "I'm not 100% accurate, please consult a doctor for confirmation."`;

    let finalPrompt = `${tone}\n`;

    if (extractedText) {
      finalPrompt += `The user has uploaded a medical report. Here is the extracted text:\n${extractedText}\n\nNow analyze this report and explain it in ${
        isHindi ? 'Hindi' : 'English'
      } language.`;
    } else {
      finalPrompt += `User: ${prompt || ''}`;
    }

    // 🧩 Step 3: Call Gemini API
    const body = {
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
    };

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
        } catch (err) {
          console.error(`❌ Gemini model error [${model}]:`, err.message);
          continue;
        }
      }
    }

    return "Sorry, I'm unable to respond right now. Please try again later.";

  } catch (err) {
    console.error('💥 Gemini Service Error:', err);
    return 'Something went wrong while analyzing your file.';
  }
};
