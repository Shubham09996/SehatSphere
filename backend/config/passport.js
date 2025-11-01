import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import config from './config.js';
import Patient from '../models/Patient.js'; // Import Patient model
import Doctor from '../models/Doctor.js'; // Import Doctor model
import Shop from '../models/Shop.js'; // Import Shop model

// Configure Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleAuth.clientId,
            clientSecret: config.googleAuth.clientSecret,
            callbackURL: '/api/users/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            const profilePicture = profile.photos[0].value;
            const googleId = profile.id;
            const name = profile.displayName;

            try {
                let user = await User.findOne({ googleId: googleId });
                let isNewUserFlag = false; // Flag to track if the user is truly new

                if (user) {
                    // User found by googleId, log them in
                    user.isNewUser = false; // Explicitly set to false for existing users
                    // Populate specificProfileId for existing users
                    if (user.role === 'Patient') {
                        const patientProfile = await Patient.findOne({ user: user._id });
                        if (patientProfile) user.specificProfileId = patientProfile.patientId;
                    } // Add similar logic for Doctor, Shop, Hospital if needed
                    await user.save(); // Save the updated user
                    done(null, user);
                } else {
                    // No user with this googleId, check by email
                    user = await User.findOne({ email: email });

                    if (user) {
                        // User found by email, link googleId to existing account
                        user.googleId = googleId;
                        user.profilePicture = profilePicture || user.profilePicture; // Update profile picture if available
                        user.isNewUser = false; // Explicitly set to false for existing users
                        // Populate specificProfileId for existing users linked by email
                        if (user.role === 'Patient') {
                            const patientProfile = await Patient.findOne({ user: user._id });
                            if (patientProfile) user.specificProfileId = patientProfile.patientId;
                        } // Add similar logic for Doctor, Shop, Hospital if needed
                        await user.save();
                        done(null, user);
                    } else {
                        // No user found by googleId or email, create a new one
                        isNewUserFlag = true;
                        const newUser = {
                            googleId: googleId,
                            name: name,
                            email: email,
                            password: Math.random().toString(36).slice(-8), // Generate a random password for Google users
                            profilePicture: profilePicture || '/uploads/default.jpg',
                            role: 'Patient', // Default role for new users via Google
                            isNewUser: true, // Mark as new user
                        };
                        user = await User.create(newUser);

                        // Create a specific profile based on the role
                        if (user.role === 'Patient') {
                            const newPatientId = `PID-${Date.now()}`;
                            const patientProfile = await Patient.create({
                                user: user._id,
                                name: name, // Use Google profile name
                                patientId: newPatientId,
                            });
                            user.specificProfileId = patientProfile.patientId;
                            user.patient = patientProfile._id;
                        } else if (user.role === 'Doctor') {
                            // Placeholder for doctor creation, assuming defaults for now
                            const doctorProfile = await Doctor.create({
                                user: user._id,
                                name: name,
                                medicalRegistrationNumber: `MRN-${Date.now()}`,
                                hospital: null, // This would need to be handled during onboarding or separately
                            });
                            user.specificProfileId = doctorProfile._id;
                        } else if (user.role === 'Shop') {
                            // Placeholder for shop creation
                            const shopProfile = await Shop.create({
                                user: user._id,
                                name: name,
                                address: 'To be updated',
                            });
                            user.specificProfileId = shopProfile._id;
                        } else if (user.role === 'Hospital') {
                            // Hospital profile will be created during onboarding
                            user.specificProfileId = null;
                        }

                        await user.save(); // Save the updated user with specificProfileId and patient reference
                        done(null, user); // Pass the user object with specificProfileId
                    }
                }
            } catch (err) {
                console.error('Error in GoogleStrategy callback:', err);
                done(err, false);
            }
        }
    )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, false);
    }
});

export default passport;
