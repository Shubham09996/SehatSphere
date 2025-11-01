import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Shop from '../models/Shop.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import sendEmail from '../utils/sendEmail.js'; // NEW: Import sendEmail utility
import crypto from 'crypto'; // NEW: Import crypto for token generation
// Removed OAuth2Client import as it's no longer used for client-side Google Auth
// Removed config import for googleAuth as it's no longer directly used here

// Removed client initialization for OAuth2Client as it's no longer used

// Removed googleAuth controller as it's no longer used for client-side Google Auth

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    // Set JWT in Http-Only Cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none', // Changed from 'strict' to 'none' for cross-site cookies
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    let specificProfileId = null;
    if (user.role === 'Patient') {
      const patientProfile = await Patient.findOne({ user: user._id });
      if (patientProfile) specificProfileId = patientProfile.patientId;
    } else if (user.role === 'Doctor') {
      const doctorProfile = await Doctor.findOne({ user: user._id });
      if (doctorProfile) specificProfileId = doctorProfile.medicalRegistrationNumber; // Assuming this is the doctor's ID
    } else if (user.role === 'Shop') {
      const shopProfile = await Shop.findOne({ user: user._id });
      if (shopProfile) specificProfileId = shopProfile._id; // Assuming _id is sufficient for shop
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      status: user.status,
      specificProfileId: specificProfileId, // Include the role-specific ID
      token: token, // NEW: Include token in the response
      isNewUser: false, // Explicitly set to false for existing users
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, phoneNumber, hospital } = req.body;
  const profilePictureFile = req.file; // Get the uploaded file from multer

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let profilePictureUrl = '/uploads/default.jpg'; // Default avatar

  if (profilePictureFile) {
      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(profilePictureFile.buffer);
      profilePictureUrl = cloudinaryResult.secure_url; // Use secure_url from Cloudinary response
  }

  const user = await User.create({
    name: fullName, // Use fullName for the user's name
    email,
    password,
    role,
    phoneNumber,
    profilePicture: profilePictureUrl,
  });

  if (user) {
    // Create corresponding profile based on role
    let specificProfileId = null;
    if (user.role === 'Patient') {
        const patientProfile = await Patient.create({
            user: user._id,
            name: user.name, // Add the user's name to the patient profile
            patientId: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
            // other patient defaults
        });
        // Link the patient profile to the user
        user.patient = patientProfile._id;
        await user.save(); // Save the updated user with patient reference
        specificProfileId = patientProfile.patientId;
    } else if (user.role === 'Doctor') {
        const doctorProfile = await Doctor.create({
            user: user._id,
            medicalRegistrationNumber: `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
            specialty: 'General Medicine',
            qualifications: 'MBBS',
            hospital: hospital, // Pass the hospital ID here
            // other doctor defaults
        });
        specificProfileId = doctorProfile.medicalRegistrationNumber;
    } else if (user.role === 'Shop') {
        const shopProfile = await Shop.create({
            user: user._id,
            name: `${user.name}'s Pharmacy`,
            address: 'Default Address',
            location: 'Default Location',
            // other shop defaults
        });
        specificProfileId = shopProfile._id;
    }

    const token = generateToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none', // Changed from 'strict' to 'none' for cross-site cookies
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      status: user.status,
      specificProfileId: specificProfileId, // Include the role-specific ID
      token: token, // NEW: Include token in the response
      isNewUser: true, // Mark as new user for registration
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    let specificProfile = null;
    if (user.role === 'Patient') {
        specificProfile = await Patient.findOne({ user: user._id });
    } else if (user.role === 'Doctor') {
        specificProfile = await Doctor.findOne({ user: user._id });
    } else if (user.role === 'Shop') {
        specificProfile = await Shop.findOne({ user: user._id });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      status: user.status,
      specificProfile, // Include role-specific profile data
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Update corresponding profile based on role if necessary
    if (updatedUser.role === 'Patient') {
        const patientProfile = await Patient.findOne({ user: updatedUser._id });
        if (patientProfile) {
            patientProfile.dob = req.body.dob || patientProfile.dob;
            patientProfile.gender = req.body.gender || patientProfile.gender;
            patientProfile.bloodGroup = req.body.bloodGroup || patientProfile.bloodGroup;
            // Update other patient-specific fields as needed
            await patientProfile.save();
        }
    } else if (updatedUser.role === 'Doctor') {
        const doctorProfile = await Doctor.findOne({ user: updatedUser._id });
        if (doctorProfile) {
            doctorProfile.specialty = req.body.specialty || doctorProfile.specialty;
            doctorProfile.qualifications = req.body.qualifications || doctorProfile.qualifications;
            doctorProfile.experience = req.body.experience || doctorProfile.experience;
            doctorProfile.bio = req.body.bio || doctorProfile.bio;
            doctorProfile.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : doctorProfile.isAvailable;
            // Update other doctor-specific fields
            await doctorProfile.save();
        }
    } else if (updatedUser.role === 'Shop') {
        const shopProfile = await Shop.findOne({ user: updatedUser._id });
        if (shopProfile) {
            shopProfile.name = req.body.shopName || shopProfile.name;
            shopProfile.address = req.body.address || shopProfile.address;
            shopProfile.location = req.body.location || shopProfile.location;
            shopProfile.phone = req.body.shopPhone || shopProfile.phone;
            shopProfile.email = req.body.shopEmail || shopProfile.email;
            shopProfile.logo = req.body.logo || shopProfile.logo;
            // Update other shop-specific fields
            await shopProfile.save();
        }
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      phoneNumber: updatedUser.phoneNumber,
      isVerified: updatedUser.isVerified,
      status: updatedUser.status,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
        if (!(await user.matchPassword(currentPassword))) {
            res.status(401);
            throw new Error('Current password is incorrect');
        }

        if (!newPassword || newPassword.length < 6) {
            res.status(400);
            throw new Error('New password must be at least 6 characters long');
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user notification preferences
// @route   PUT /api/users/notification-preferences
// @access  Private
const updateNotificationPreferences = asyncHandler(async (req, res) => {
    const { email, sms, inApp } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
        user.notificationPreferences = user.notificationPreferences || {}; // Initialize if null/undefined
        if (email !== undefined) {
            user.notificationPreferences.email = email;
        }
        if (sms !== undefined) {
            user.notificationPreferences.sms = sms;
        }
        if (inApp !== undefined) {
            user.notificationPreferences.inApp = inApp;
        }

        await user.save();

        res.json({ message: 'Notification preferences updated successfully', preferences: user.notificationPreferences });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users/all
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password'); // Do not send passwords
    res.json(users);
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prevent admin from changing their own role, or changing super admin role
    if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('Cannot change your own role');
    }
    // You might want to add more robust logic to prevent accidental super admin role changes

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: { _id: user._id, role: user.role } });
});

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('Cannot delete your own account');
    }

    await user.deleteOne();

    // Optionally, delete associated patient, doctor, or shop profiles
    if (user.role === 'Patient') {
        await Patient.deleteOne({ user: user._id });
    } else if (user.role === 'Doctor') {
        await Doctor.deleteOne({ user: user._id });
    } else if (user.role === 'Shop') {
        await Shop.deleteOne({ user: user._id });
    }

    res.json({ message: 'User removed successfully' });
});

// @desc    Admin update user profile (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const adminUpdateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { name, email, phoneNumber, role, isVerified, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prevent admin from updating their own status/role if it would lock them out.
    if (user._id.toString() === req.user._id.toString() && (status === 'Suspended' || role !== user.role)) {
        res.status(400);
        throw new Error('Admin cannot change their own status or role via this route');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;
    user.role = role ?? user.role;
    user.isVerified = isVerified ?? user.isVerified;
    user.status = status ?? user.status; // e.g., Active, Suspended, Deactivated

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        isVerified: updatedUser.isVerified,
        status: updatedUser.status,
    });
});

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found with that email address');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL (should point to frontend for user interaction)
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password:</p>
        <a href="${resetURL}" clicktracking=off>${resetURL}</a>
        <p>This token is valid for 10 minutes.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        console.error(error);
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token or token has expired');
    }

    if (!req.body.password || req.body.password.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters long');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
});

export { authUser, registerUser, getUserProfile, updateUserProfile, logoutUser, changePassword, updateNotificationPreferences, getUsers, updateUserRole, deleteUser, adminUpdateUser, forgotPassword, resetPassword };
