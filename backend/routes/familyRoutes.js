import express from 'express';
import { addFamilyMember, getFamilyMembers, getFamilyMemberProfile } from '../controllers/familyController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer'; // Import multer for file uploads

const router = express.Router();

// Configure multer for file storage
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept image files
        } else {
            cb(new Error('Only image files are allowed!'), false); // Reject other files
        }
    }
});

router.post('/add', protect, upload.single('profilePicture'), addFamilyMember);
router.get('/my-family-members', protect, getFamilyMembers);
router.get('/:id', protect, getFamilyMemberProfile); // New route for single family member profile

export default router;
