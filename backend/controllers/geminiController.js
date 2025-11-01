import asyncHandler from 'express-async-handler';
import fs from 'fs';
import { getChatbotResponse } from '../services/geminiService.js';

// @desc   Get Gemini chatbot response
// @route  POST /api/gemini/chat
// @access Private
const getGeminiResponse = asyncHandler(async (req, res) => {
  // multer text fields are inside req.body
  const userMessage = req.body.message;
  const language = req.body.language || 'en';
  const file = req.file;

  if (!userMessage && !file) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a message or upload a file.',
    });
  }

  const uploadedFilePath = file?.path || null;
  const userName = req.user?.name || 'User';

  try {
    // send everything to Gemini
    const geminiResponse = await getChatbotResponse(
      userMessage,
      userName,
      language,
      uploadedFilePath
    );

    // cleanup after processing
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    res.status(200).json({ response: geminiResponse });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Gemini response. Please try again later.',
    });
  }
});

export default getGeminiResponse;
