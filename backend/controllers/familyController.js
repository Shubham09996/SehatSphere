import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import uploadToCloudinary from '../utils/cloudinary.js'; // Import cloudinary utility

// Helper to generate a unique patient ID (e.g., P-randomstring)
const generateUniquePatientId = async () => {
  let patientId;
  let isUnique = false;
  while (!isUnique) {
    patientId = 'P-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const existingPatient = await Patient.findOne({ patientId });
    if (!existingPatient) {
      isUnique = true;
    }
  }
  return patientId;
};

// @desc    Add a family member to a patient's profile
// @route   POST /api/family/add
// @access  Private (Patient only)
const addFamilyMember = asyncHandler(async (req, res) => {
  const { name, dob, gender, bloodGroup } = req.body;
  const emergencyContactName = req.body['emergencyContact.name'];
  const emergencyContactRelation = req.body['emergencyContact.relation'];
  const emergencyContactPhone = req.body['emergencyContact.phone'];
  const allergiesString = req.body.allergies;
  const chronicConditionsString = req.body.chronicConditions;

  const userId = req.user._id; // The logged-in user
  const profilePictureFile = req.file; // Get the uploaded file from multer

  // Basic validation
  if (!name || !dob || !gender) {
    res.status(400);
    throw new Error('Please enter all required fields: name, date of birth, and gender');
  }

  // Find the primary patient associated with the logged-in user
  const primaryUser = await User.findById(userId);
  if (!primaryUser || !primaryUser.patient) {
    res.status(404);
    throw new Error('Primary patient profile not found for this user');
  }

  const primaryPatient = await Patient.findById(primaryUser.patient);
  if (!primaryPatient) {
    res.status(404);
    throw new Error('Primary patient profile not found');
  }

  // Count existing family members for this primary patient
  const familyMembersCount = await Patient.countDocuments({ primaryPatient: primaryPatient._id });

  if (familyMembersCount >= 6) {
    res.status(400);
    throw new Error('You can add a maximum of 6 family members.');
  }

  const patientId = await generateUniquePatientId();

  let profilePictureUrl = '/uploads/default.jpg'; // Default avatar

  if (profilePictureFile) {
      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(profilePictureFile.buffer);
      profilePictureUrl = cloudinaryResult.secure_url; // Use secure_url from Cloudinary response
  }

  // Construct emergencyContact object
  const emergencyContactObject = {
      name: emergencyContactName || '',
      relation: emergencyContactRelation || '',
      phone: emergencyContactPhone || '',
  };

  // Parse allergies and chronic conditions (they come as arrays from FormData if multiple values, or single string)
  const parsedAllergies = Array.isArray(allergiesString) ? allergiesString.map(a => a.trim()) : (allergiesString ? allergiesString.split(',').map(a => a.trim()) : []);
  const parsedChronicConditions = Array.isArray(chronicConditionsString) ? chronicConditionsString.map(c => c.trim()) : (chronicConditionsString ? chronicConditionsString.split(',').map(c => c.trim()) : []);

  // Create the new family member patient profile
  const familyMember = await Patient.create({
    user: userId, // Link family member to the primary user's User account (for simplicity, or could create a dummy user)
    primaryPatient: primaryPatient._id,
    patientId,
    name, // Assuming name is passed in body as per signup-like form
    dob,
    gender,
    profilePicture: profilePictureUrl, // Add profile picture URL
    bloodGroup,
    emergencyContact: emergencyContactObject,
    allergies: parsedAllergies,
    chronicConditions: parsedChronicConditions,
  });

  if (familyMember) {
    res.status(201).json({
      message: 'Family member added successfully',
      familyMember: {
        _id: familyMember._id,
        patientId: familyMember.patientId,
        name: familyMember.name,
        dob: familyMember.dob,
        gender: familyMember.gender,
        profilePicture: familyMember.profilePicture, // Include profile picture in response
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid family member data');
  }
});

// @desc    Get all family members for the logged-in patient
// @route   GET /api/family/my-family-members
// @access  Private (Patient only)
const getFamilyMembers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find the primary patient associated with the logged-in user
  const primaryUser = await User.findById(userId);
  if (!primaryUser || !primaryUser.patient) {
    res.status(404);
    throw new Error('Primary patient profile not found for this user');
  }

  const primaryPatientId = primaryUser.patient;

  // Find all patients who have this primaryPatientId as their primaryPatient
  const familyMembers = await Patient.find({ primaryPatient: primaryPatientId })
    .select('-password -__v') // Exclude sensitive info
    .populate('user', 'name email profilePicture'); // Populate user details

  res.status(200).json(familyMembers);
});

// @desc    Get a single family member's profile by ID
// @route   GET /api/family/:id
// @access  Private (Patient only, can view their own family members)
const getFamilyMemberProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const primaryUser = await User.findById(userId);
  if (!primaryUser || !primaryUser.patient) {
    res.status(404);
    throw new Error('Primary patient profile not found for this user');
  }

  const primaryPatientId = primaryUser.patient;

  const familyMember = await Patient.findOne({
    _id: id,
    primaryPatient: primaryPatientId,
  }).select('-password -__v');

  if (familyMember) {
    res.status(200).json(familyMember);
  } else {
    res.status(404);
    throw new Error('Family member not found or you do not have permission to view this profile');
  }
});

export { addFamilyMember, getFamilyMembers, getFamilyMemberProfile };
