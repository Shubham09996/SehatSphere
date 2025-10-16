import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  changePassword, // NEW: Import changePassword
  updateNotificationPreferences, // NEW: Import updateNotificationPreferences
  getUsers, // NEW: Import getUsers for Admin
  updateUserRole, // NEW: Import updateUserRole for Admin
  deleteUser, // NEW: Import deleteUser for Admin
  adminUpdateUser, // NEW: Import adminUpdateUser for Admin
  forgotPassword, // NEW: Import forgotPassword for password reset
  resetPassword, // NEW: Import resetPassword for password reset
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import multer from 'multer';
import passport from 'passport'; // Import passport
import generateToken from '../utils/generateToken.js'; // Import generateToken

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('profilePicture'), registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

// Google OAuth routes (using Passport.js)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=google_failed' }),
    (req, res) => {
        // Successful authentication, generate JWT and set cookie
        const token = generateToken(req.user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        // Redirect to frontend dashboard or onboarding page
        const redirectPath = req.user.isNewUser && req.user.role.toLowerCase() === 'patient'
            ? `/patient-onboarding/${req.user._id}`
            : `/${req.user.role.toLowerCase()}/dashboard`;

        res.redirect(`http://localhost:5173${redirectPath}`); // Removed query params here, frontend will fetch
    }
);

// Removed client-side Google Auth route
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

// NEW: Route for forgot password
router.post('/forgot-password', forgotPassword);

// NEW: Route for reset password
router.put('/reset-password/:token', resetPassword);

export default router;
