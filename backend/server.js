import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import { patientRoutes } from './routes/patientRoutes.js'; // Import patientRoutes as named export
import hospitalRoutes from './routes/hospitalRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import healthRecordRoutes from './routes/healthRecordRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import shopInventoryRoutes from './routes/shopInventoryRoutes.js';
import donationCenterRoutes from './routes/donationCenterRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import familyRoutes from './routes/familyRoutes.js'; // Import family routes
import config from './config/config.js'; // Import config
import passport from './config/passport.js'; // Import passport config
import session from 'express-session'; // Import express-session


dotenv.config();

connectDB();

const app = express();

// Session middleware (required for passport)
app.use(session({
    secret: config.jwtSecret, // Use JWT secret for session secret
    resave: false,
    saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://vibe-clash-3iyt.vercel.app', 'https://vibe-clash-mm73.vercel.app'], credentials: true })); // Enable CORS for frontend

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes); // Re-enable userRoutes
app.use('/api/patients', patientRoutes); // Re-enable patientRoutes
console.log('server.js: Using patientRoutes'); // Debug log
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/healthrecords', healthRecordRoutes);
app.use('/api/billings', billingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shopinventories', shopInventoryRoutes);
app.use('/api/donationcenters', donationCenterRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gemini', geminiRoutes); // New Gemini chatbot routes
app.use('/api/family', familyRoutes); // New Family management routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
