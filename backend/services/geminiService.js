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
  'models/gemini-pro-vision',
  'models/gemini-2.5-flash',
  'models/gemini-1.5-flash-latest',
  'models/gemini-1.0-pro-latest',
];

export const getChatbotResponse = async (prompt, userName, language, file = null) => {
  console.log('geminiService: file received:', file);
  if (!GEMINI_API_KEY) {
    return "Assistant connection issue. Please try again later.";
  }

  const patientName = userName || 'User';
  const isHindi = (language || '').toLowerCase() === 'hi';

  let extractedText = '';

  try {
    let finalPrompt = '';
    let imageBase64 = null;
    let modelToUse = PRIMARY_MODELS[0]; // Default to first model

    // 🔍 Step 1: File handling
    if (file && fs.existsSync(file.path)) {
        console.log('geminiService: File exists at path:', file.path);
        const ext = path.extname(file.path).toLowerCase();

            if (ext === '.pdf') {
                const pdfData = await pdfParse(fs.readFileSync(file.path));
                extractedText = pdfData.text;
                console.log('📄 PDF text extracted successfully');
            } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                // For image files, read as base64 for Gemini Vision
                imageBase64 = fs.readFileSync(file.path).toString('base64');
                modelToUse = 'models/gemini-pro-vision'; // Use vision model
                console.log('🖼️ Image converted to base64 for Vision API. modelToUse:', modelToUse);
                // console.log('imageBase64 sample:', imageBase64.substring(0, 50) + '...'); // Log first 50 chars

                // Also perform OCR for text extraction as a fallback/additional info
                const result = await Tesseract.recognize(file.path, 'eng');
                extractedText = result.data.text;
                console.log('🖼️ Image OCR extracted successfully');
            }
        }

        // 🧠 Step 2: Create prompt
        const tone = isHindi
            ? `You are HealthSphere’s friendly and helpful patient assistant.\n             Talk to the patient by their name (${patientName}) and clearly answer all health-related queries.\n             End each response with: "Main 100% sahi nahi ho sakta, kripya doctor se consult kare."`
            : `You are HealthSphere’s friendly and helpful patient assistant.\n             Always address the patient by their name (${patientName}) and clearly answer all health-related queries.\n             End each response with: "I'm not 100% accurate, please consult a doctor for confirmation."`;

        let userQueryText = prompt || ''; // User's original message

        // Remove the `[File: filename]` prefix from userQueryText if present
        if (file && userQueryText.startsWith(`[File: ${file.originalname}]`)) {
            userQueryText = userQueryText.substring(`[File: ${file.originalname}]`.length).trim();
        }

        if (imageBase64) {
            finalPrompt = `${tone}\n`;
            finalPrompt += `The user has provided an image for analysis. `;
            if (extractedText) {
                finalPrompt += `Here is the extracted text from the image: "${extractedText}". `;
            }
            if (userQueryText) {
                finalPrompt += `User's additional query: "${userQueryText}". `;
            }
            finalPrompt += `Please analyze the image content `;
            if (extractedText) {
                finalPrompt += `along with the extracted text `;
            }
            finalPrompt += `and respond in ${isHindi ? 'Hindi' : 'English'} language.`
        } else if (extractedText) { // Only extracted text (e.g., from PDF, or OCR from image without explicit image analysis instruction)
            finalPrompt = `${tone}\n`;
            finalPrompt += `The user has uploaded a medical report. Here is the extracted text:\n"${extractedText}"\n\n`;
            finalPrompt += `Analyze this report and explain it in ${isHindi ? 'Hindi' : 'English'} language.`
            if (userQueryText) {
                finalPrompt += ` User also said: "${userQueryText}".`;
            }
        } else { // No file or image, just text prompt
            finalPrompt = `${tone}\nUser: ${userQueryText}`;
        }

        // 🧩 Step 3: Call Gemini API
        const parts = [];
        if (imageBase64) {
            parts.push({
                inlineData: {
                    mimeType: file.mimetype,
                    data: imageBase64,
                },
            });
        }
        if (finalPrompt) {
            parts.push({ text: finalPrompt }); // Always add the constructed text prompt
        }

        const body = {
            contents: [{ role: 'user', parts: parts }],
        };
        console.log('geminiService: Final Gemini API request body:', JSON.stringify(body, null, 2));
        console.log('geminiService: Model to use:', modelToUse);

        // Use the selected model (vision or default)
        for (const model of [modelToUse, ...PRIMARY_MODELS.filter(m => m !== modelToUse)]) { // Prioritize modelToUse
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
    } finally {
        // Cleanup the uploaded file after processing
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }
};
