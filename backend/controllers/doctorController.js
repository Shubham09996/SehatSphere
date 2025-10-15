import asyncHandler from 'express-async-handler';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js'; // Added Prescription import
import Review from '../models/Review.js'; // Added Review import
import mongoose from 'mongoose'; // Added mongoose import for ObjectId

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const { specialty, hospital } = req.query;
  let query = {};

  if (specialty) {
    query.specialty = specialty;
  }

  if (hospital) {
    // Assuming hospital query parameter is the hospital's ID
    query.hospital = hospital;
  }

  const doctors = await Doctor.find(query).populate('user', 'name email profilePicture phoneNumber').populate('hospital', 'name location'); // Populate hospital info
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
  const { userId, specialty, qualifications, experience, medicalRegistrationNumber, bio, expertise, consultationFee, appointmentDuration, hospital } = req.body;

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
    hospital, // Add hospital here
  });

  const createdDoctor = await doctor.save();
  res.status(201).json(createdDoctor);
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor or Admin
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const { specialty, qualifications, experience, bio, expertise, consultationFee, appointmentDuration, isAvailable, name, profilePicture, workSchedule, hospital } = req.body;

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
    doctor.medicalRegistrationNumber = identifier ?? doctor.medicalRegistrationNumber;
    doctor.bio = bio ?? doctor.bio;
    doctor.expertise = expertise ?? doctor.expertise;
    doctor.consultationFee = consultationFee ?? doctor.consultationFee;
    doctor.appointmentDuration = appointmentDuration ?? doctor.appointmentDuration;
    if (isAvailable !== undefined) {
        doctor.isAvailable = isAvailable;
    }
    if (workSchedule !== undefined) {
        doctor.workSchedule = workSchedule;
    }
    if (hospital !== undefined) {
        doctor.hospital = hospital;
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
    const { date, hospitalId, specialty } = req.query; // Add hospitalId and specialty

    if (!date) {
        res.status(400);
        throw new Error('Date query parameter is required.');
    }

    let doctorsToConsider = [];

    if (doctorId === 'first_available') {
        if (!hospitalId) { // specialty is now optional
            res.status(400);
            throw new Error('Hospital ID is required for first available doctor search.');
        }
        let findQuery = { hospital: new mongoose.Types.ObjectId(hospitalId) }; // Explicitly convert to ObjectId
        if (specialty) {
            findQuery.specialty = specialty;
        }
        doctorsToConsider = await Doctor.find(findQuery).populate('user'); // Add populate user
        if (doctorsToConsider.length === 0) {
            return res.json([]); // No doctors found for this criteria
        }
    } else {
        const singleDoctor = await Doctor.findById(doctorId).populate('user'); // Add populate user
        if (!singleDoctor) {
            res.status(404);
            throw new Error('Doctor not found');
        }
        doctorsToConsider = [singleDoctor];
    }

    const combinedAvailableSlots = new Set();

    for (const doctor of doctorsToConsider) {
        const doctorSchedule = doctor.workSchedule;
        const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' });
        const scheduleForDay = doctorSchedule ? doctorSchedule.get(dayOfWeek) : null;

        if (!scheduleForDay || !scheduleForDay.enabled) {
            continue;
        }

        const startTime = scheduleForDay.from;
        const endTime = scheduleForDay.to;
        const appointmentDuration = doctor.appointmentDuration || 15;

        const existingAppointments = await Appointment.find({
            doctor: doctor._id,
            date: new Date(date),
            status: { $ne: 'Cancelled' }
        });
        const bookedSlots = existingAppointments.map(app => app.time);

        let currentHour = parseInt(startTime.split(':')[0]);
        let currentMinute = parseInt(startTime.split(':')[1]);
        const endHour = parseInt(endTime.split(':')[0]);
        const endMinute = parseInt(endTime.split(':')[1]);

        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const slotTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
            if (!bookedSlots.includes(slotTime)) {
                combinedAvailableSlots.add({ time: slotTime, doctorId: doctor._id, doctorName: doctor.user?.name });
            }

            currentMinute += appointmentDuration;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
        }
    }

    const sortedSlots = Array.from(combinedAvailableSlots).sort((a, b) => {
        const timeA = parseInt(a.time.replace(':', ''));
        const timeB = parseInt(b.time.replace(':', ''));
        return timeA - timeB;
    });

    const uniqueTimes = Array.from(new Set(sortedSlots.map(slot => slot.time)));

    const slotsWithStatus = uniqueTimes.map(time => ({ time: time, status: 'available' }));

    res.json(slotsWithStatus);
});

const getDoctorDashboardStats = asyncHandler(async (req, res) => {
    const medicalRegistrationNumber = req.params.medicalRegistrationNumber;
    const doctor = await Doctor.findOne({ medicalRegistrationNumber: medicalRegistrationNumber });
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalPatients = await Appointment.distinct('patient', { doctor: doctor._id }); // Removed status filter

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

    const pendingReports = await Prescription.countDocuments({
        doctor: doctor._id,
        status: { $ne: 'Active' },
    });

    const upcomingAppointmentsCount = await Appointment.countDocuments({
        doctor: doctor._id,
        date: { $gte: today },
        status: { $in: ['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'] }
    });

    const totalPrescriptions = await Prescription.countDocuments({
        doctor: doctor._id,
    });

    res.json({
        doctorInfo: { name: req.user.name, profilePicture: doctor.user.profilePicture },
        dashboardStats: {
            totalPatients: { value: totalPatients.length, change: '+5%' },
            avgConsultationTime: { value: `${avgConsultationTime} mins`, change: '-2%' },
            pendingReports: { value: pendingReports, change: '+1' },
        },
        upcomingAppointmentsCount: upcomingAppointmentsCount,
        totalPrescriptions: totalPrescriptions,
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
    .populate({
        path: 'patient',
        select: 'patientId dob gender medicalHistory allergies chronicConditions emergencyContact recentVitals user',
        populate: {
            path: 'user',
            select: 'name profilePicture'
        }
    })
    .sort('date time');

    const formattedQueue = appointmentQueue.map(app => {
        const dob = new Date(app.patient.dob);
        const ageDiffMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        return {
            id: app._id,
            patientId: app.patient.patientId, // Include patientId here
            name: app.patient.user.name, // Access name from populated user
            profilePicture: app.patient.user.profilePicture, // Access profilePicture from populated user
            age: age,
            time: app.time,
            status: app.status,
            reason: app.reason,
            patient: app.patient, // Include the entire patient object
        };
    });

    res.json(formattedQueue);
});

// @desc    Get daily availability for a doctor for a given month
// @route   GET /api/doctors/daily-availability/:doctorId
// @access  Public
const getDoctorDailyAvailability = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId;
    const { year, month, hospitalId, specialty } = req.query; // Add hospitalId and specialty

    if (!year || !month) {
        res.status(400);
        throw new Error('Year and month query parameters are required.');
    }

    let doctorsToConsider = [];

    if (doctorId === 'first_available') {
        if (!hospitalId) { // specialty is now optional
            res.status(400);
            throw new Error('Hospital ID is required for first available doctor search.');
        }
        let findQuery = { hospital: new mongoose.Types.ObjectId(hospitalId) }; // Explicitly convert to ObjectId
        if (specialty) {
            findQuery.specialty = specialty;
        }
        doctorsToConsider = await Doctor.find(findQuery).populate('user'); // Add populate user
        if (doctorsToConsider.length === 0) {
            return res.json({}); // No doctors found for this criteria
        }
    } else {
        const singleDoctor = await Doctor.findById(doctorId).populate('user'); // Add populate user
        if (!singleDoctor) {
            res.status(404);
            throw new Error('Doctor not found');
        }
        doctorsToConsider = [singleDoctor];
    }

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, parseInt(month) + 1, 0); // Last day of the month

    const dailyAvailability = {};
    const allBookedSlotsInMonth = await Appointment.find({
        doctor: { $in: doctorsToConsider.map(d => d._id) },
        date: { $gte: startOfMonth, $lte: endOfMonth },
        status: { $ne: 'Cancelled' }
    });

    const bookedSlotsMap = new Map();
    allBookedSlotsInMonth.forEach(app => {
        const dateStr = app.date.toISOString().split('T')[0];
        if (!bookedSlotsMap.has(dateStr)) {
            bookedSlotsMap.set(dateStr, new Set());
        }
        bookedSlotsMap.get(dateStr).add(app.time);
    });

    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        let totalPossibleSlotsForDay = 0;
        let totalBookedSlotsForDay = 0;
        const bookedSlotsOnDate = bookedSlotsMap.get(dateStr) || new Set();

        for (const doctor of doctorsToConsider) {
            const dayOfWeek = d.toLocaleString('en-us', { weekday: 'long' });
            const scheduleForDay = doctor.workSchedule ? doctor.workSchedule.get(dayOfWeek) : null;

            if (!scheduleForDay || !scheduleForDay.enabled) {
                continue;
            }

            const startTime = scheduleForDay.from;
            const endTime = scheduleForDay.to;
            const appointmentDuration = doctor.appointmentDuration || 15;

            let currentHour = parseInt(startTime.split(':')[0]);
            let currentMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);

            let doctorPossibleSlots = 0;
            while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
                doctorPossibleSlots++;
                currentMinute += appointmentDuration;
                if (currentMinute >= 60) {
                    currentHour += Math.floor(currentMinute / 60);
                    currentMinute %= 60;
                }
            }
            totalPossibleSlotsForDay += doctorPossibleSlots;
        }
        totalBookedSlotsForDay = bookedSlotsOnDate.size;

        const availableSlotsCount = totalPossibleSlotsForDay - totalBookedSlotsForDay;
        const dayOfMonth = d.getDate();

        if (totalPossibleSlotsForDay === 0) {
            dailyAvailability[dateStr] = 'unavailable';
        } else if ([15, 16, 17, 18].includes(dayOfMonth)) {
            dailyAvailability[dateStr] = 'fully_available';
        } else if (availableSlotsCount <= 0) {
            dailyAvailability[dateStr] = 'unavailable';
        } else if (availableSlotsCount < totalPossibleSlotsForDay) {
            dailyAvailability[dateStr] = 'partially_available';
        } else {
            dailyAvailability[dateStr] = 'fully_available';
        }
    }

    res.json(dailyAvailability);
});

export { getDoctors, getDoctorById, createDoctorProfile, updateDoctorProfile, deleteDoctorProfile, updateDoctorSchedule, getAvailableDoctorSlots, getDoctorDailyAvailability, getDoctorDashboardStats, updateAppointmentStatus, getDoctorHourlyActivity, getDoctorAppointmentQueue };
