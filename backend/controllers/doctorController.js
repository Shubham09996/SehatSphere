import asyncHandler from 'express-async-handler';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js'; // Added Prescription import
import Review from '../models/Review.js'; // Added Review import

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({}).populate('user', 'name email profilePicture phoneNumber');
  res.json(doctors);
});

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const identifier = req.params.medicalRegistrationNumber || req.params.id;
  let doctor;

  if (req.params.medicalRegistrationNumber) {
    doctor = await Doctor.findOne({ medicalRegistrationNumber: identifier }).populate('user', 'name email profilePicture phoneNumber');
  } else if (req.params.id) {
    doctor = await Doctor.findById(identifier).populate('user', 'name email profilePicture phoneNumber');
  } else {
    res.status(400);
    throw new Error('Doctor ID or Medical Registration Number not provided');
  }

  if (doctor) {
    const reviews = await Review.find({ reviewedEntity: doctor._id, onModel: 'Doctor' }).populate('user', 'name');

    // Calculate performance metrics for the profile page
    const totalPatients = await Appointment.distinct('patient', { doctor: doctor._id, status: 'Completed' });
    const consultationsThisMonth = await Appointment.countDocuments({
        doctor: doctor._id,
        date: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        status: 'Completed',
    });

    // Monthly consultations for chart
    const monthlyConsultations = await Appointment.aggregate([
        {
            $match: {
                doctor: doctor._id,
                status: 'Completed',
                date: { $gte: new Date(new Date().getFullYear() - 1, 0, 1) } // Last 12 months
            }
        },
        {
            $group: {
                _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        }
    ]);

    const formattedMonthlyConsultations = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
            month: date.toLocaleString('en-US', { month: 'short' }),
            count: 0
        };
    }).reverse(); // To get chronological order

    monthlyConsultations.forEach(mc => {
        const monthName = new Date(mc._id.year, mc._id.month - 1).toLocaleString('en-US', { month: 'short' });
        const monthIndex = formattedMonthlyConsultations.findIndex(item => item.month === monthName);
        if (monthIndex !== -1) {
            formattedMonthlyConsultations[monthIndex].count = mc.count;
        }
    });

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
      ...doctor.toObject(), // Convert mongoose document to plain object
      personalInfo: {
          name: doctor.user.name,
          pfp: doctor.user.profilePicture,
          profilePicture: doctor.user.profilePicture, // Added profilePicture to personalInfo
          specialty: doctor.specialty,
          qualifications: doctor.qualifications,
          experience: doctor.experience,
          bio: doctor.bio,
          isVerified: doctor.user.isVerified, // Assuming isVerified is on User model
      },
      performance: {
          totalPatients: totalPatients.length,
          consultationsThisMonth,
          avgRating,
          monthlyConsultations: formattedMonthlyConsultations,
      },
      reviews: reviews.map(review => ({
          patientName: review.user.name,
          rating: review.rating,
          comment: review.comment,
      })),
    });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Create a doctor profile (Admin only, typically created during user registration)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctorProfile = asyncHandler(async (req, res) => {
  const { userId, specialty, qualifications, experience, medicalRegistrationNumber, bio, expertise, consultationFee, appointmentDuration } = req.body;

  const user = await User.findById(userId);
  if (!user || user.role !== 'Doctor') {
    res.status(400);
    throw new Error('User not found or not a Doctor role');
  }

  const doctorExists = await Doctor.findOne({ user: userId });
  if (doctorExists) {
    res.status(400);
    throw new Error('Doctor profile already exists for this user');
  }

  const doctor = new Doctor({
    user: userId,
    specialty,
    qualifications,
    experience,
    medicalRegistrationNumber,
    bio,
    expertise,
    consultationFee,
    appointmentDuration,
  });

  const createdDoctor = await doctor.save();
  res.status(201).json(createdDoctor);
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor or Admin
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const { specialty, qualifications, experience, bio, expertise, consultationFee, appointmentDuration, isAvailable, name, profilePicture, workSchedule } = req.body;

  const identifier = req.params.medicalRegistrationNumber || req.params.id;
  let doctor;

  if (req.params.medicalRegistrationNumber) {
      doctor = await Doctor.findOne({ medicalRegistrationNumber: identifier }).populate('user');
  } else if (req.params.id) {
      doctor = await Doctor.findById(identifier).populate('user');
  } else {
      res.status(400);
      throw new Error('Doctor ID or Medical Registration Number not provided');
  }

  if (doctor) {
    // Ensure only the doctor themselves or an admin can update
    if (req.user.role !== 'Admin' && doctor.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this doctor profile');
    }

    // Update User model fields
    if (name !== undefined) {
        doctor.user.name = name;
    }
    if (profilePicture !== undefined) {
        doctor.user.profilePicture = profilePicture;
    }
    await doctor.user.save();

    // Update Doctor model fields
    doctor.specialty = specialty ?? doctor.specialty;
    doctor.qualifications = qualifications ?? doctor.qualifications;
    doctor.experience = experience ?? doctor.experience;
    doctor.medicalRegistrationNumber = identifier ?? doctor.medicalRegistrationNumber; // Added medicalRegistrationNumber
    doctor.bio = bio ?? doctor.bio;
    doctor.expertise = expertise ?? doctor.expertise;
    doctor.consultationFee = consultationFee ?? doctor.consultationFee;
    doctor.appointmentDuration = appointmentDuration ?? doctor.appointmentDuration;
    if (isAvailable !== undefined) {
        doctor.isAvailable = isAvailable;
    }
    if (workSchedule !== undefined) {
        // Merge or replace the existing work schedule
        // If `workSchedule` is a complete object, replace it
        // If you want to merge, you'd need more complex logic here
        doctor.workSchedule = workSchedule;
    }

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Update doctor work schedule
// @route   PUT /api/doctors/schedule/:id
// @access  Private/Doctor or Admin
const updateDoctorSchedule = asyncHandler(async (req, res) => {
    const { workSchedule } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (doctor) {
        if (req.user.role !== 'Admin' && doctor.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this doctor schedule');
        }

        doctor.workSchedule = workSchedule; // Replace entire schedule or merge as needed

        const updatedDoctor = await doctor.save();
        res.json(updatedDoctor);
    } else {
        res.status(404);
        throw new Error('Doctor not found');
    }
});

// @desc    Delete a doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    await doctor.deleteOne();
    res.json({ message: 'Doctor profile removed' });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Get available slots for a doctor
// @route   GET /api/doctors/available-slots/:doctorId
// @access  Public
const getAvailableDoctorSlots = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId;
    const { date } = req.query; // Date should be passed as YYYY-MM-DD

    if (!date) {
        res.status(400);
        throw new Error('Date query parameter is required.');
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    // Parse doctor's work schedule
    const doctorSchedule = doctor.workSchedule;
    const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' });
    const scheduleForDay = doctorSchedule.get(dayOfWeek);

    if (!scheduleForDay || !scheduleForDay.enabled) {
        return res.json([]); // Doctor not available on this day
    }

    const startTime = scheduleForDay.from;
    const endTime = scheduleForDay.to;
    const appointmentDuration = doctor.appointmentDuration || 15; // Default to 15 minutes

    // Fetch existing appointments for the doctor on the given date
    const existingAppointments = await Appointment.find({
        doctor: doctorId,
        date: new Date(date),
        status: { $ne: 'Cancelled' } // Exclude cancelled appointments
    });

    const bookedSlots = existingAppointments.map(app => app.time);

    // Generate all possible slots for the day
    const allPossibleSlots = [];
    let currentHour = parseInt(startTime.split(':')[0]);
    let currentMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const slotTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        allPossibleSlots.push(slotTime);

        currentMinute += appointmentDuration;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute %= 60;
        }
    }

    // Filter out booked slots
    const availableSlots = allPossibleSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
});

const getDoctorDashboardStats = asyncHandler(async (req, res) => {
    const medicalRegistrationNumber = req.params.medicalRegistrationNumber;
    console.log("getDoctorDashboardStats - medicalRegistrationNumber:", medicalRegistrationNumber); // Debug log
    const doctor = await Doctor.findOne({ medicalRegistrationNumber: medicalRegistrationNumber });
    console.log("getDoctorDashboardStats - doctor found:", doctor); // Debug log
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total number of patients attended by this doctor (unique patients with completed appointments)
    const totalPatients = await Appointment.distinct('patient', { doctor: doctor._id, status: 'Completed' });

    // Appointments completed today for average consultation time calculation
    const completedAppointmentsToday = await Appointment.find({
        doctor: doctor._id,
        date: { $gte: today, $lt: tomorrow },
        status: 'Completed',
    }).select('createdAt updatedAt');

    let totalConsultationDuration = 0;
    completedAppointmentsToday.forEach(appointment => {
        if (appointment.createdAt && appointment.updatedAt) {
            const duration = (appointment.updatedAt.getTime() - appointment.createdAt.getTime()) / (1000 * 60); // duration in minutes
            totalConsultationDuration += duration;
        }
    });

    const avgConsultationTime = completedAppointmentsToday.length > 0
        ? (totalConsultationDuration / completedAppointmentsToday.length).toFixed(1)
        : 0;

    // Pending Reports - Assuming pending reports are prescriptions with 'Pending' status, or a similar concept.
    // For now, let's assume 'Pending Reports' refers to prescriptions that are not yet marked 'Active'.
    const pendingReports = await Prescription.countDocuments({
        doctor: doctor._id,
        status: { $ne: 'Active' }, // Adjust based on actual Prescription statuses for "pending"
    });

    // Upcoming appointments for this doctor
    const upcomingAppointmentsCount = await Appointment.countDocuments({
        doctor: doctor._id,
        date: { $gte: today },
        status: { $in: ['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'] }
    });

    // Number of prescriptions created by this doctor
    const totalPrescriptions = await Prescription.countDocuments({
        doctor: doctor._id,
    });

    res.json({
        doctorInfo: { name: req.user.name, profilePicture: doctor.user.profilePicture }, // Assuming name is from user object
        dashboardStats: {
            totalPatients: { value: totalPatients.length, change: '+5%' }, // Placeholder for change
            avgConsultationTime: { value: `${avgConsultationTime} mins`, change: '-2%' }, // Placeholder for change
            pendingReports: { value: pendingReports, change: '+1' }, // Placeholder for change
        },
        // Keep existing values or remove if no longer needed separately
        upcomingAppointmentsCount: upcomingAppointmentsCount,
        totalPrescriptions: totalPrescriptions,
        // appointmentQueue: [], // This will be fetched separately for real-time updates - Removed
    });
});

// @desc    Update appointment status
// @route   PUT /api/doctors/appointments/:id/status
// @access  Private/Doctor
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id).populate('doctor', 'user');

  if (appointment) {
    // Check if the logged-in user is the doctor associated with the appointment
    if (appointment.doctor.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this appointment status');
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

const getDoctorHourlyActivity = asyncHandler(async (req, res) => {
    const medicalRegistrationNumber = req.params.medicalRegistrationNumber;
    const doctor = await Doctor.findOne({ medicalRegistrationNumber: medicalRegistrationNumber });
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }
    // Moved hourly activity logic from getDoctorDashboardStats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const hourlyActivity = await Appointment.aggregate([
        {
            $match: {
                doctor: doctor._id,
                date: { $gte: today, $lt: tomorrow },
                status: { $in: ['Completed', 'Now Serving', 'Up Next', 'Waiting', 'Pending', 'Confirmed'] }
            }
        },
        {
            $group: {
                _id: {
                    $hour: {
                        date: "$date",
                        timezone: "Asia/Kolkata"
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const formattedHourlyActivity = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        appointments: 0
    }));

    hourlyActivity.forEach(activity => {
        const hourIndex = formattedHourlyActivity.findIndex(item => item.hour === activity._id);
        if (hourIndex !== -1) {
            formattedHourlyActivity[hourIndex].appointments = activity.count;
        }
    });

    res.json(formattedHourlyActivity);
});

const getDoctorAppointmentQueue = asyncHandler(async (req, res) => {
    const medicalRegistrationNumber = req.params.medicalRegistrationNumber;
    const doctor = await Doctor.findOne({ medicalRegistrationNumber: medicalRegistrationNumber });
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentQueue = await Appointment.find({
        doctor: doctor._id,
        date: { $gte: today },
        status: { $in: ['Now Serving', 'Up Next', 'Waiting', 'Pending', 'Confirmed'] }
    })
    .populate('patient', 'name profilePicture')
    .sort('date time');

    // Transform the queue data to match frontend expectations (id, name, time, status)
    const formattedQueue = appointmentQueue.map(app => ({
        id: app._id,
        name: app.patient.name,
        time: app.time,
        status: app.status,
    }));

    res.json(formattedQueue);
});

export { getDoctors, getDoctorById, createDoctorProfile, updateDoctorProfile, deleteDoctorProfile, updateDoctorSchedule, getAvailableDoctorSlots, getDoctorDashboardStats, updateAppointmentStatus, getDoctorHourlyActivity, getDoctorAppointmentQueue };
