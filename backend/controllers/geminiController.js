import asyncHandler from 'express-async-handler';
import { getChatbotResponse } from '../services/geminiService.js';

// @desc    Get Gemini chatbot response
// @route   POST /api/gemini/chat
// @access  Private
const getGeminiResponse = asyncHandler(async (req, res) => {
    const { message, language } = req.body;

    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    const userName = req.user ? req.user.name : null; // Assuming user info is attached by auth middleware
    const geminiResponse = await getChatbotResponse(message, userName, language);

    res.json({ response: geminiResponse });
});

export { getGeminiResponse };
