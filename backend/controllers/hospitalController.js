import asyncHandler from 'express-async-handler';
import Hospital from '../models/Hospital.js';
import User from '../models/User.js'; // NEW: Import User model
import Doctor from '../models/Doctor.js'; // NEW: Import Doctor model
import Patient from '../models/Patient.js'; // NEW: Import Patient model
import Appointment from '../models/Appointment.js'; // NEW: Import Appointment model

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
const getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({});
  res.json(hospitals);
});

// @desc    Get single hospital by ID
// @route   GET /api/hospitals/:id
// @access  Public
const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404);
    throw new Error('Hospital not found');
  }
});

// @desc    Create a hospital
// @route   POST /api/hospitals
// @access  Private/Admin
const createHospital = asyncHandler(async (req, res) => {
  const { name, location, address, image, contactEmail, contactPhone, departments } = req.body;

  const hospitalExists = await Hospital.findOne({ name });

  if (hospitalExists) {
    res.status(400);
    throw new Error('Hospital with this name already exists');
  }

  const hospital = new Hospital({
    name,
    location,
    address,
    image: image || '/uploads/default_hospital.jpg',
    contactEmail,
    contactPhone,
    departments,
  });

  const createdHospital = await hospital.save();
  res.status(201).json(createdHospital);
});

// @desc    Update a hospital
// @route   PUT /api/hospitals/:id
// @access  Private/Admin
const updateHospital = asyncHandler(async (req, res) => {
  const { name, location, address, image, contactEmail, contactPhone, departments, stats } = req.body;

  const hospital = await Hospital.findById(req.params.id);

  if (hospital) {
    hospital.name = name || hospital.name;
    hospital.location = location || hospital.location;
    hospital.address = address || hospital.address;
    hospital.image = image || hospital.image;
    hospital.contactEmail = contactEmail || hospital.contactEmail;
    hospital.contactPhone = contactPhone || hospital.contactPhone;
    hospital.departments = departments || hospital.departments;
    if (stats) {
      hospital.stats.totalDoctors = stats.totalDoctors || hospital.stats.totalDoctors;
      hospital.stats.patientsToday = stats.patientsToday || hospital.stats.patientsToday;
      hospital.stats.avgWaitTime = stats.avgWaitTime || hospital.stats.avgWaitTime;
      hospital.stats.rating = stats.rating || hospital.stats.rating;
    }

    const updatedHospital = await hospital.save();
    res.json(updatedHospital);
  } else {
    res.status(404);
    throw new Error('Hospital not found');
  }
});

// @desc    Delete a hospital
// @route   DELETE /api/hospitals/:id
// @access  Private/Admin
const deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (hospital) {
    await hospital.deleteOne();
    res.json({ message: 'Hospital removed' });
  } else {
    res.status(404);
    throw new Error('Hospital not found');
  }
});

// @desc    Onboard a new hospital
// @route   POST /api/hospitals/onboard
// @access  Private/Hospital
const onboardHospital = asyncHandler(async (req, res) => {
    const { 
        hospitalName, address, city, state, zipCode, phoneNumber, email, 
        description, licenseNumber, directorName, numberOfBeds, website, 
        specialties, emergencyServices, user: userId, departments 
    } = req.body;

    console.log('DEBUG: onboardHospital - Incoming request body:', req.body); // Add this line
    console.log('DEBUG: onboardHospital - Departments from req.body:', departments); // Add this line

    // Ensure the user is authenticated and is a Hospital role
    if (!req.user || req.user.role !== 'Hospital' || req.user._id.toString() !== userId) {
        res.status(401);
        throw new Error('Not authorized to onboard this hospital');
    }

    // Check if a hospital profile already exists for this user
    const existingHospital = await Hospital.findOne({ user: userId });
    if (existingHospital) {
        res.status(400);
        throw new Error('Hospital profile already exists for this user');
    }

    const hospital = new Hospital({
        name: hospitalName,
        user: userId,
        address,
        city,
        state,
        zipCode,
        phoneNumber,
        email,
        description,
        licenseNumber,
        directorName,
        numberOfBeds,
        website,
        specialties,
        emergencyServices,
        departments, // Save departments array
        status: 'Pending', // NEW: Set initial status to Pending
        // You might want to add default values for other fields here if not provided
        location: `${city}, ${state}` // Simple location string, can be improved with GeoJSON
    });

    console.log('DEBUG: onboardHospital - Hospital object before save:', hospital); // Add this line
    console.log('DEBUG: onboardHospital - Hospital.departments before save:', hospital.departments, 'Type:', typeof hospital.departments); // Add this line

    const createdHospital = await hospital.save();

    // Update the User model to mark onboarding as complete and link to hospital profile
    const user = await User.findById(userId);
    if (user) {
        user.specificProfileId = createdHospital._id; // Link to the new hospital's _id
        user.isOnboarded = true; // Mark onboarding as complete
        await user.save();
    }

    res.status(201).json(createdHospital);
});

// @desc    Update hospital status (Admin only)
// @route   PUT /api/hospitals/:id/status
// @access  Private/Admin
const updateHospitalStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const hospitalId = req.params.id;

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
        res.status(404);
        throw new Error('Hospital not found');
    }

    // Validate status
    const allowedStatuses = ['Pending', 'Active', 'Suspended', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status provided. Allowed: ${allowedStatuses.join(', ')}`);
    }

    hospital.status = status;
    await hospital.save();

    // Optionally, update the associated user's status as well if needed
    const user = await User.findById(hospital.user);
    if (user) {
        if (status === 'Active') {
            user.status = 'Active';
        } else if (status === 'Suspended' || status === 'Rejected') {
            user.status = 'Suspended'; // Or another appropriate status for the user
        }
        await user.save();
    }

    res.json({ message: `Hospital status updated to ${status}`, hospital });
});

// @desc    Get hospital profile for the logged-in Hospital user
// @route   GET /api/hospitals/profile
// @access  Private/Hospital
const getHospitalProfile = asyncHandler(async (req, res) => {
    const hospital = await Hospital.findOne({ user: req.user._id });

    if (hospital) {
        res.json(hospital);
    } else {
        res.status(404);
        throw new Error('Hospital profile not found');
    }
});

// @desc    Update hospital profile for the logged-in Hospital user
// @route   PUT /api/hospitals/profile
// @access  Private/Hospital
const updateHospitalProfile = asyncHandler(async (req, res) => {
    const {
        name, address, city, state, zipCode, phoneNumber, email,
        description, licenseNumber, directorName, numberOfBeds, website,
        specialties: specialtiesString, // Rename to avoid conflict with parsed array
        emergencyServices
    } = req.body;

    const hospital = await Hospital.findOne({ user: req.user._id });

    if (hospital) {
        hospital.name = name || hospital.name;
        hospital.address = address || hospital.address;
        hospital.city = city || hospital.city;
        hospital.state = state || hospital.state;
        hospital.zipCode = zipCode || hospital.zipCode;
        hospital.phoneNumber = phoneNumber || hospital.phoneNumber;
        hospital.contactEmail = email || hospital.contactEmail; // Use contactEmail for consistency
        hospital.contactPhone = phoneNumber || hospital.contactPhone; // Use contactPhone for consistency
        hospital.description = description || hospital.description;
        hospital.licenseNumber = licenseNumber || hospital.licenseNumber;
        hospital.directorName = directorName || hospital.directorName;
        hospital.numberOfBeds = numberOfBeds !== undefined ? numberOfBeds : hospital.numberOfBeds;
        hospital.website = website || hospital.website;

        // Parse specialties string back to array
        if (specialtiesString) {
            try {
                hospital.specialties = JSON.parse(specialtiesString);
            } catch (error) {
                console.error('Error parsing specialties JSON:', error);
                res.status(400);
                throw new Error('Invalid specialties format');
            }
        } else {
            hospital.specialties = [];
        }

        hospital.emergencyServices = emergencyServices !== undefined ? emergencyServices : hospital.emergencyServices;
        hospital.location = `${city || hospital.city}, ${state || hospital.state}`; // Update location based on city/state

        // Handle image upload
        if (req.file) {
            hospital.image = `/uploads/${req.file.filename}`; // Save path to the uploaded image
        }

        const updatedHospital = await hospital.save();
        res.json(updatedHospital);
    } else {
        res.status(404);
        throw new Error('Hospital profile not found');
    }
});

// @desc    Get hospital dashboard summary
// @route   GET /api/hospitals/dashboard-summary
// @access  Private/Hospital
const getHospitalDashboardSummary = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId; // The ID of the logged-in hospital

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // --- KPIs ---
    const totalDoctors = await Doctor.countDocuments({ hospital: hospitalId });
    // Assuming 'online' status for doctors is tracked in the Doctor model, or a presence system
    const onlineDoctors = Math.floor(totalDoctors * 0.7); // Placeholder: 70% of doctors are online

    const totalAppointmentsToday = await Appointment.countDocuments({
        hospital: hospitalId,
        date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }
    });

    const upcomingAppointments = await Appointment.countDocuments({
        hospital: hospitalId,
        date: { $gte: new Date() },
        status: 'Scheduled' // Assuming 'Scheduled' is a status for future appointments
    });

    // Placeholder for patients waiting - this would typically involve a more complex real-time system
    const patientsWaiting = Math.floor(totalAppointmentsToday * 0.2); // Placeholder: 20% of today's appointments are waiting

    // Placeholder for today's earnings and total revenue
    const todayRevenue = Math.floor(Math.random() * 100000) + 20000; // Random revenue between 20k and 120k
    const totalRevenue = Math.floor(Math.random() * 5000000) + 1000000; // Random revenue between 1M and 6M

    // --- Charts Data (Placeholders for now) ---
    const appointmentStatusData = [
        { name: 'Scheduled', value: Math.floor(totalAppointmentsToday * 0.4) },
        { name: 'Completed', value: Math.floor(totalAppointmentsToday * 0.3) },
        { name: 'Cancelled', value: Math.floor(totalAppointmentsToday * 0.2) },
        { name: 'Pending', value: Math.floor(totalAppointmentsToday * 0.1) },
    ];

    const monthlyRevenueData = [
        { month: 'Jan', Revenue: Math.floor(Math.random() * 500000) + 100000 },
        { month: 'Feb', Revenue: Math.floor(Math.random() * 500000) + 100000 },
        { month: 'Mar', Revenue: Math.floor(Math.random() * 500000) + 100000 },
        { month: 'Apr', Revenue: Math.floor(Math.random() * 500000) + 100000 },
        { month: 'May', Revenue: Math.floor(Math.random() * 500000) + 100000 },
        { month: 'Jun', Revenue: Math.floor(Math.random() * 500000) + 100000 },
        { month: 'Jul', Revenue: Math.floor(Math.random() * 500000) + 100000 },
    ];

    // --- Other Placeholder Data ---
    const patientFeedbackData = [
        { month: 'Jan', wait_time: 15 },
        { month: 'Feb', wait_time: 12 },
        { month: 'Mar', wait_time: 10 },
        { month: 'Apr', wait_time: 11 },
        { month: 'May', wait_time: 13 },
        { month: 'Jun', wait_time: 14 },
        { month: 'Jul', wait_time: 16 },
    ];

    const fraudIncidentsData = [
        { type: 'Unauthorized Access', date: '2023-07-20', details: 'Attempted login from a suspicious IP' },
        { type: 'Suspicious Activity', date: '2023-07-21', details: 'Multiple failed login attempts from a single IP' },
        { type: 'Data Breach', date: '2023-07-22', details: 'Suspicious data export request' },
    ];

    const stockLevelsData = [
        { item: 'Paracetamol', stock: 100 },
        { item: 'Ibuprofen', stock: 50 },
        { item: 'Aspirin', stock: 200 },
        { item: 'Vitamin C', stock: 75 },
    ];

    const doctorsList = await Doctor.find({ hospital: hospitalId }).select('name specialty status');

    const aiAssignment = {
        status: 'Active',
        lastRun: '2023-07-24 10:30 AM',
    };

    const jobPostings = [
        { title: 'Cardiologist', applicants: 5 },
        { title: 'Pediatric Nurse', applicants: 12 },
        { title: 'Lab Technician', applicants: 8 },
    ];

    const roles = [
        { name: 'Doctor', permissions: ['view_patients', 'manage_appointments'] },
        { name: 'Receptionist', permissions: ['schedule_appointments', 'register_patients'] },
        { name: 'Admin Staff', permissions: ['manage_staff', 'view_analytics'] },
    ];

    const tokenSystem = {
        status: 'Active',
    };

    const labTests = [
        { name: 'Complete Blood Count', price: 500 },
        { name: 'Urine Analysis', price: 200 },
        { name: 'Thyroid Panel', price: 800 },
    ];

    const bloodBank = {
        APositive: 100,
        BPositive: 80,
        OPositive: 120,
        ANegative: 30,
    };

    const insuranceIntegrations = [
        { name: 'HealthSecure', status: 'Active' },
        { name: 'MediCare', status: 'Inactive' },
    ];

    const patients = await Patient.find({ hospital: hospitalId }).select('name status');

    res.json({
        kpis: {
            onlineDoctors: { value: onlineDoctors, change: '+2%' },
            waitingPatients: { value: patientsWaiting, change: '-5%' },
            totalAppointments: { value: totalAppointmentsToday, change: '+10%' },
            todayEarnings: { value: todayRevenue, change: '+8%' },
        },
        operationalInsights: {
            doctorsOnline: onlineDoctors,
            patientsWaiting: patientsWaiting,
            totalAppointmentsToday: totalAppointmentsToday,
            upcomingAppointments: upcomingAppointments,
            tokenDistributionStatus: 'Normal',
        },
        financialInsights: {
            todayRevenue: todayRevenue,
            platformSubscriptionModel: 'Premium',
            totalRevenue: totalRevenue,
        },
        appointmentStatusData: appointmentStatusData,
        monthlyRevenueData: monthlyRevenueData,
        patientFeedbackData: patientFeedbackData,
        fraudIncidentsData: fraudIncidentsData,
        stockLevelsData: stockLevelsData,
        doctors: doctorsList,
        aiAssignment: aiAssignment,
        jobPostings: jobPostings,
        roles: roles,
        tokenSystem: tokenSystem,
        labTests: labTests,
        bloodBank: bloodBank,
        insuranceIntegrations: insuranceIntegrations,
        patients: patients,
    });
});

// @desc    Get all patients for the logged-in Hospital user
// @route   GET /api/hospitals/patients
// @access  Private/Hospital
const getHospitalPatients = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId; // The ID of the logged-in hospital

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    const patients = await Patient.find({ hospital: hospitalId }).select('name status age gender lastVisit'); // Select relevant patient fields

    res.json(patients);
});

// @desc    Get doctors for the logged-in Hospital user
// @route   GET /api/hospitals/doctors
// @access  Private/Hospital
const getHospitalDoctors = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    const doctors = await Doctor.find({ hospital: hospitalId }).select('name specialty status');

    res.json(doctors);
});

// @desc    Get job postings for the logged-in Hospital user
// @route   GET /api/hospitals/job-postings
// @access  Private/Hospital
const getHospitalJobPostings = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for job postings - replace with actual DB query when job posting model is available
    const jobPostings = [
        { title: 'Cardiologist', applicants: 5 },
        { title: 'Pediatric Nurse', applicants: 12 },
        { title: 'Lab Technician', applicants: 8 },
    ];

    res.json(jobPostings);
});

// @desc    Get roles for the logged-in Hospital user
// @route   GET /api/hospitals/roles
// @access  Private/Hospital
const getHospitalRoles = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for roles - replace with actual DB query when role/permission models are available
    const roles = [
        { name: 'Doctor', permissions: ['view_patients', 'manage_appointments'] },
        { name: 'Receptionist', permissions: ['schedule_appointments', 'register_patients'] },
        { name: 'Admin Staff', permissions: ['manage_staff', 'view_analytics'] },
    ];

    res.json(roles);
});

// @desc    Get AI assignment status for the logged-in Hospital user
// @route   GET /api/hospitals/ai-assignment
// @access  Private/Hospital
const getHospitalAIAssignment = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for AI assignment - replace with actual DB query when AI assignment model is available
    const aiAssignment = {
        status: 'Active',
        lastRun: '2023-07-24 10:30 AM',
    };

    res.json(aiAssignment);
});

// @desc    Get token system status for the logged-in Hospital user
// @route   GET /api/hospitals/token-system
// @access  Private/Hospital
const getHospitalTokenSystem = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for token system - replace with actual DB query when token system model is available
    const tokenSystem = {
        status: 'Active',
    };

    res.json(tokenSystem);
});

// @desc    Get lab tests for the logged-in Hospital user
// @route   GET /api/hospitals/lab-tests
// @access  Private/Hospital
const getHospitalLabTests = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for lab tests - replace with actual DB query when lab test model is available
    const labTests = [
        { name: 'Complete Blood Count', price: 500 },
        { name: 'Urine Analysis', price: 200 },
        { name: 'Thyroid Panel', price: 800 },
    ];

    res.json(labTests);
});

// @desc    Get blood bank data for the logged-in Hospital user
// @route   GET /api/hospitals/blood-bank
// @access  Private/Hospital
const getHospitalBloodBank = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for blood bank - replace with actual DB query when blood bank model is available
    const bloodBank = {
        APositive: 100,
        BPositive: 80,
        OPositive: 120,
        ANegative: 30,
    };

    res.json(bloodBank);
});

// @desc    Get insurance integrations for the logged-in Hospital user
// @route   GET /api/hospitals/insurance-integrations
// @access  Private/Hospital
const getHospitalInsuranceIntegrations = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for insurance integrations - replace with actual DB query when insurance model is available
    const insuranceIntegrations = [
        { name: 'HealthSecure', status: 'Active' },
        { name: 'MediCare', status: 'Inactive' },
    ];

    res.json(insuranceIntegrations);
});

// @desc    Get pharmacy partners for the logged-in Hospital user
// @route   GET /api/hospitals/pharmacy-partners
// @access  Private/Hospital
const getHospitalPharmacyPartners = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for pharmacy partners - replace with actual DB query when pharmacy partner model is available
    const pharmacyPartners = [
        { id: 1, name: 'MediCare Pharmacy', contact: '+91 98765 43210', address: '123 Health St, City, State', lastOrder: '2023-10-26' },
        { id: 2, name: 'LifeLink Pharmacy', contact: '+91 87654 32109', address: '456 Wellness Ave, City, State', lastOrder: '2023-10-20' },
        { id: 3, name: 'HealthHub Pharmacy', contact: '+91 76543 21098', address: '789 Care Rd, City, State', lastOrder: '2023-10-15' },
    ];

    res.json(pharmacyPartners);
});

// @desc    Add a new pharmacy partner for the logged-in Hospital user
// @route   POST /api/hospitals/pharmacy-partners
// @access  Private/Hospital
const addHospitalPharmacyPartner = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;
    const { pharmacyName, contactPerson, contactNumber, address } = req.body;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder: In a real application, you would create a new PharmacyPartner document
    // linked to the hospitalId in your database.
    console.log(`Hospital ${hospitalId} attempting to add new pharmacy partner: ${pharmacyName}`);

    res.status(201).json({ message: 'Pharmacy partner added successfully (placeholder)', pharmacyName, contactPerson, contactNumber, address });
});

// @desc    Get patient feedback data for the logged-in Hospital user
// @route   GET /api/hospitals/patient-feedback
// @access  Private/Hospital
const getHospitalPatientFeedback = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for patient feedback - replace with actual DB query when model is available
    const patientFeedbackData = [
        { month: 'Jan', wait_time: 15 },
        { month: 'Feb', wait_time: 12 },
        { month: 'Mar', wait_time: 10 },
        { month: 'Apr', wait_time: 11 },
        { month: 'May', wait_time: 13 },
        { month: 'Jun', wait_time: 14 },
        { month: 'Jul', wait_time: 16 },
    ];

    res.json(patientFeedbackData);
});

// @desc    Get fraud incidents data for the logged-in Hospital user
// @route   GET /api/hospitals/fraud-incidents
// @access  Private/Hospital
const getHospitalFraudIncidents = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for fraud incidents - replace with actual DB query when model is available
    const fraudIncidentsData = [
        { type: 'Unauthorized Access', date: '2023-07-20', details: 'Attempted login from a suspicious IP' },
        { type: 'Suspicious Activity', date: '2023-07-21', details: 'Multiple failed login attempts from a single IP' },
        { type: 'Data Breach', date: '2023-07-22', details: 'Suspicious data export request' },
    ];

    res.json(fraudIncidentsData);
});

// @desc    Get stock levels data for the logged-in Hospital user
// @route   GET /api/hospitals/stock-levels
// @access  Private/Hospital
const getHospitalStockLevels = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for stock levels - replace with actual DB query when model is available
    const stockLevelsData = [
        { item: 'Paracetamol', stock: 100 },
        { item: 'Ibuprofen', stock: 50 },
        { item: 'Aspirin', stock: 200 },
        { item: 'Vitamin C', stock: 75 },
    ];

    res.json(stockLevelsData);
});

// @desc    Get notifications for the logged-in Hospital user
// @route   GET /api/hospitals/notifications
// @access  Private/Hospital
const getHospitalNotifications = asyncHandler(async (req, res) => {
    const hospitalId = req.user.specificProfileId;

    if (!hospitalId) {
        res.status(400);
        throw new Error('Hospital ID not found for the logged-in user.');
    }

    // Placeholder data for notifications - replace with actual DB query when model is available
    const notifications = [
        { id: 1, type: 'New Appointment', message: 'Dr. Sharma has a new appointment scheduled for tomorrow.', time: '2 hours ago' },
        { id: 2, type: 'Critical Alert', message: 'Emergency patient admitted in ER.', time: '4 hours ago' },
        { id: 3, type: 'System Update', message: 'Dashboard analytics updated successfully.', time: '1 day ago' },
        { id: 4, type: 'Staff Leave', message: 'Dr. Khan will be on leave next week.', time: '2 days ago' },
        { id: 5, type: 'Low Stock', message: 'Paracetamol stock is running low.', time: '3 days ago' },
    ];

    res.json(notifications);
});

export { getHospitals, getHospitalById, createHospital, updateHospital, deleteHospital, onboardHospital, getHospitalProfile, updateHospitalProfile, updateHospitalStatus, getHospitalDashboardSummary, getHospitalPatients, getHospitalDoctors, getHospitalJobPostings, getHospitalRoles, getHospitalAIAssignment, getHospitalTokenSystem, getHospitalLabTests, getHospitalBloodBank, getHospitalInsuranceIntegrations, getHospitalPharmacyPartners, addHospitalPharmacyPartner, getHospitalPatientFeedback, getHospitalFraudIncidents, getHospitalStockLevels, getHospitalNotifications };
