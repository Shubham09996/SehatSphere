import asyncHandler from 'express-async-handler';
import Lab from '../models/Lab.js';
import User from '../models/User.js';
import LabTestOrder from '../models/LabTestOrder.js'; // NEW: Import LabTestOrder
import Patient from '../models/Patient.js'; // NEW: Import Patient model
import Doctor from '../models/Doctor.js'; // NEW: Import Doctor model
import moment from 'moment'; // NEW: Import moment for date calculations

// @desc    Get lab profile
// @route   GET /api/labs/:id/profile
// @access  Private/Lab
const getLabProfile = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).populate('user', 'name email');

  if (lab) {
    res.json(lab);
  } else {
    res.status(404);
    throw new Error('Lab not found');
  }
});

// @desc    Update lab profile
// @route   PUT /api/labs/:id/profile
// @access  Private/Lab
const updateLabProfile = asyncHandler(async (req, res) => {
  const { name, address, phone, email, website } = req.body;

  const lab = await Lab.findById(req.params.id);

  if (lab) {
    lab.name = name || lab.name;
    lab.address = address || lab.address;
    lab.phone = phone || lab.phone;
    lab.email = email || lab.email;
    lab.website = website || lab.website;

    const updatedLab = await lab.save();

    res.json({
      _id: updatedLab._id,
      name: updatedLab.name,
      labId: updatedLab.labId,
      address: updatedLab.address,
      phone: updatedLab.phone,
      email: updatedLab.email,
      website: updatedLab.website,
    });
  } else {
    res.status(404);
    throw new Error('Lab not found');
  }
});

// @desc    Get all labs (Admin only)
// @route   GET /api/labs
// @access  Private/Admin
const getLabs = asyncHandler(async (req, res) => {
  const labs = await Lab.find({}).populate('user', 'name email');
  res.json(labs);
});

// @desc    Delete a lab (Admin only)
// @route   DELETE /api/labs/:id
// @access  Private/Admin
const deleteLab = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id);

  if (lab) {
    await User.deleteOne({ _id: lab.user }); // Delete associated user account
    await Lab.deleteOne({ _id: lab._id });
    res.json({ message: 'Lab and associated user removed' });
  } else {
    res.status(404);
    throw new Error('Lab not found');
  }
});

// @desc    Get lab dashboard statistics
// @route   GET /api/labs/dashboard/stats
// @access  Private/Lab
const getLabDashboardStats = asyncHandler(async (req, res) => {
  const labId = req.user.lab; // Assuming req.user.lab contains the ID of the authenticated lab

  // Calculate today's test orders
  const startOfToday = moment().startOf('day').toDate();
  const endOfToday = moment().endOf('day').toDate();
  const todayTestOrders = await LabTestOrder.countDocuments({
    lab: labId,
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });

  // Calculate pending reports (e.g., tests with 'Sample Collected' or 'In Progress' status)
  const pendingReports = await LabTestOrder.countDocuments({
    lab: labId,
    status: { $in: ['Sample Collected', 'In Progress'] },
  });

  // Placeholder for low stock alerts - needs a dedicated inventory model
  const lowStockAlerts = 0;

  res.status(200).json({
    todayTestOrders,
    todayTestOrdersTrend: 'up', // Placeholder - implement real trend logic if needed
    todayTestOrdersChange: '+0%', // Placeholder
    pendingReports,
    pendingReportsTrend: 'down', // Placeholder
    pendingReportsChange: '-0%', // Placeholder
    lowStockAlerts,
    lowStockAlertsTrend: 'up', // Placeholder
    lowStockAlertsChange: '+0%', // Placeholder
  });
});

// @desc    Get recent lab orders
// @route   GET /api/labs/dashboard/recent-orders
// @access  Private/Lab
const getRecentLabOrders = asyncHandler(async (req, res) => {
  const labId = req.user.lab; // Assuming req.user.lab contains the ID of the authenticated lab

  const recentOrders = await LabTestOrder.find({ lab: labId })
    .sort({ createdAt: -1 })
    .limit(5) // Get the 5 most recent orders
    .populate('patient', 'name'); // Populate patient name

  const formattedOrders = recentOrders.map(order => ({
    id: order._id,
    patient: order.patient.name,
    test: order.testName,
    status: order.status,
    time: moment(order.createdAt).format('hh:mm A'), // Format time
    patientId: order.patient._id,
  }));
  res.json(formattedOrders);
});

// @desc    Get lab inventory summary
// @route   GET /api/labs/dashboard/inventory-summary
// @access  Private/Lab
const getLabInventorySummary = asyncHandler(async (req, res) => {
  // Placeholder for now. Implement actual inventory logic when a dedicated inventory model is created.
  const inventorySummary = {
    totalItems: 0,
    lowStockItems: 0,
  };
  res.json(inventorySummary);
});

// @desc    Get daily test orders trend data
// @route   GET /api/labs/dashboard/daily-trend
// @access  Private/Lab
const getDailyTestOrdersTrend = asyncHandler(async (req, res) => {
  const labId = req.user.lab; // Assuming req.user.lab contains the ID of the authenticated lab

  const sevenDaysAgo = moment().subtract(6, 'days').startOf('day');

  const dailyOrders = await LabTestOrder.aggregate([
    { $match: { lab: labId, createdAt: { $gte: sevenDaysAgo.toDate() } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } },
  ]);

  // Generate a list of the last 7 days to ensure all days are represented, even if no orders
  const lastSevenDays = Array.from({ length: 7 }, (_, i) => 
    moment().subtract(6 - i, 'days').format('YYYY-MM-DD')
  );

  const dailyTrendData = lastSevenDays.map(date => {
    const foundDay = dailyOrders.find(day => day._id === date);
    return { name: moment(date).format('ddd'), orders: foundDay ? foundDay.count : 0 };
  });

  res.json(dailyTrendData);
});

// @desc    Get all lab test orders with filtering
// @route   GET /api/labs/test-orders
// @access  Private/Lab
const getLabTestOrders = asyncHandler(async (req, res) => {
  const { dayFilter, testTypeFilter, labId } = req.query;
  const query = { lab: labId };

  // Apply day filter
  if (dayFilter && dayFilter !== 'All') {
    const now = moment();
    let startDate;
    if (dayFilter === 'Today') {
      startDate = now.startOf('day');
    } else if (dayFilter === 'Yesterday') {
      startDate = now.subtract(1, 'day').startOf('day');
    } else if (dayFilter === 'This Week') {
      startDate = now.startOf('week');
    } else if (dayFilter === 'This Month') {
      startDate = now.startOf('month');
    }
    if (startDate) {
      query.createdAt = { $gte: startDate.toDate() };
    }
  }

  // Apply test type filter
  if (testTypeFilter && testTypeFilter !== 'All') {
    query.testType = testTypeFilter;
  }

  const testOrders = await LabTestOrder.find(query)
    .populate('patient', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(testOrders);
});

// @desc    Get patients associated with the lab
// @route   GET /api/labs/patients
// @access  Private/Lab
const getLabPatients = asyncHandler(async (req, res) => {
  const { labId } = req.query;

  // Find all unique patient IDs from LabTestOrders for the given lab
  const patientIds = await LabTestOrder.distinct('patient', { lab: labId });

  // Find patients using these IDs
  const patients = await Patient.find({ _id: { $in: patientIds } }).select('_id name patientId doctor').populate('doctor', 'name');

  res.status(200).json(patients);
});

// @desc    Get doctors (can be refined to only associated doctors later)
// @route   GET /api/labs/doctors
// @access  Private/Lab
const getLabDoctors = asyncHandler(async (req, res) => {
  // For now, fetch all doctors. This can be refined to fetch doctors associated with the lab or its network.
  const doctors = await Doctor.find({}).select('_id name');

  res.status(200).json(doctors);
});

// @desc    Generate a lab report
// @route   POST /api/labs/reports/generate
// @access  Private/Lab
const generateLabReport = asyncHandler(async (req, res) => {
  const { labId, patientId, testName, testResults, comments } = req.body;

  // Create a new LabTestOrder document with the report details
  const newReport = await LabTestOrder.create({
    lab: labId,
    patient: patientId,
    testName,
    testType: 'Manual Report', // Default type for manually generated reports
    status: 'Completed',
    result: testResults, // Store test results directly here for manual reports
    comments,
    completionDate: Date.now(),
  });

  res.status(201).json({ message: 'Report generated successfully', report: newReport });
});

// @desc    Upload a lab report file
// @route   POST /api/labs/reports/upload
// @access  Private/Lab
const uploadLabReport = asyncHandler(async (req, res) => {
  // This endpoint would typically involve file upload middleware (e.g., multer)
  // and then storing the file in a cloud storage (e.g., Cloudinary) and saving the URL to the DB.
  // For now, we'll mock the success.
  res.status(200).json({ message: 'Report file uploaded successfully', fileUrl: 'mock_file_url.pdf' });
});

// @desc    Get lab reports history with optional search
// @route   GET /api/labs/reports
// @access  Private/Lab
const getLabReports = asyncHandler(async (req, res) => {
  const { labId, search } = req.query;
  const query = { lab: labId };

  if (search) {
    query.$or = [
      { testName: { $regex: search, $options: 'i' } },
      // You might also want to search by patient name, but that requires population first
    ];
  }

  const reports = await LabTestOrder.find(query)
    .populate('patient', 'name patientId')
    .sort({ createdAt: -1 });

  res.status(200).json(reports);
});

export {
  getLabProfile,
  updateLabProfile,
  getLabs,
  deleteLab,
  getLabDashboardStats,
  getRecentLabOrders,
  getLabInventorySummary,
  getDailyTestOrdersTrend,
  getLabTestOrders,
  getLabPatients, // NEW: Export getLabPatients
  getLabDoctors,  // NEW: Export getLabDoctors
  generateLabReport, // NEW: Export generateLabReport
  uploadLabReport, // NEW: Export uploadLabReport
  getLabReports, // NEW: Export getLabReports
};
