import express from 'express';
const router = express.Router();
import {
    getGeminiResponse,
} from '../controllers/geminiController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/chat', protect, getGeminiResponse);

export default router;
