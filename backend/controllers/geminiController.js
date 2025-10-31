import asyncHandler from 'express-async-handler';
import fs from 'fs';
import { getChatbotResponse } from '../services/geminiService.js';

// @desc    Get Gemini chatbot response (HealthSphere AI Assistant)
// @route   POST /api/gemini/chat
// @access  Private
const getGeminiResponse = asyncHandler(async (req, res) => {
  const { message, language } = req.body;
  const file = req.file; // uploaded report (if any)

  if (!message && !file) {
    res.status(400);
    throw new Error('Message or file is required');
  }

  const userName = req.user ? req.user.name : 'User'; // from auth middleware
  const uploadedFilePath = file?.path || null;

  try {
    // Call Gemini Service
    const geminiResponse = await getChatbotResponse(
      message,
      userName,
      language,
      uploadedFilePath
    );

    // delete uploaded file after use to save disk
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    res.status(200).json({ response: geminiResponse });
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(500).json({
      error: 'Failed to get Gemini response. Please try again later.',
    });
  }
});

export { getGeminiResponse };
