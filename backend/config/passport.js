import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import config from './config.js';
import Patient from '../models/Patient.js'; // Import Patient model

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

                if (user) {
                    // User found by googleId, log them in
                    user.isNewUser = false; // Explicitly set to false for existing users
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
                        await user.save();
                        done(null, user);
                    } else {
                        // No user found by googleId or email, create a new one
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
                        user.isNewUser = true; // Mark as new user

                        // Create a patient profile for new Google users by default
                        if (user) {
                            const patientProfile = await Patient.create({
                                user: user._id,
                                patientId: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
                                // other patient defaults if any
                            });
                            // Assign the generated patientId to the user object
                            user.specificProfileId = patientProfile.patientId;
                            await user.save(); // Save the user with the new specificProfileId
                        }
                        done(null, user);
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
