import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  googleAuth, // Make sure googleAuth is imported
  changePassword, // NEW: Import changePassword
  updateNotificationPreferences, // NEW: Import updateNotificationPreferences
  getUsers, // NEW: Import getUsers for Admin
  updateUserRole, // NEW: Import updateUserRole for Admin
  deleteUser, // NEW: Import deleteUser for Admin
  adminUpdateUser, // NEW: Import adminUpdateUser for Admin
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('profilePicture'), registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.post('/google-auth', googleAuth);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
// Route for changing password
router.route('/change-password').put(protect, changePassword);
// NEW: Route for updating notification preferences
router.route('/notification-preferences').put(protect, updateNotificationPreferences);

// NEW: Admin User Management Routes
router.route('/all').get(protect, authorizeRoles('Admin'), getUsers);
router.route('/:id/role').put(protect, authorizeRoles('Admin'), updateUserRole);
router.route('/:id').put(protect, authorizeRoles('Admin'), adminUpdateUser).delete(protect, authorizeRoles('Admin'), deleteUser);

export default router;
