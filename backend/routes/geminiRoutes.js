import express from 'express';
import multer from 'multer';
import getGeminiResponse from '../controllers/geminiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('Multer fileFilter invoked for file:', file.originalname);
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only PDF or image allowed.'));
  },
});

router.post('/chat', (req, res, next) => {
  console.log('Request received at /api/gemini/chat route, before Multer. Body:', req.body);
  next();
}, protect, upload.single('file'), getGeminiResponse);

export default router;
