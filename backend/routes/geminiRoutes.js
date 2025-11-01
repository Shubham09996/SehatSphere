import express from 'express';
import multer from 'multer';
import getGeminiResponse from '../controllers/geminiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only PDF or image allowed.'));
  },
});

router.post('/chat', protect, upload.single('file'), getGeminiResponse);

export default router;
