import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Shop from '../models/Shop.js';
import Hospital from '../models/Hospital.js';
import Order from '../models/Order.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import SystemAlert from '../models/SystemAlert.js';

// --- Admin Dashboard KPIs ---
// @desc    Get platform KPIs (Total Users, Active Hospitals, Platform Revenue, Pending Approvals)
// @route   GET /api/admin/kpis
// @access  Private/Admin
const getPlatformKpis = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const activeHospitals = await Hospital.countDocuments({ status: 'Active' }); // Assuming a status field

    const totalRevenueResult = await Order.aggregate([
        { $match: { status: 'Delivered', paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const platformRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // Pending approvals could be new Doctor/Shop registrations that need admin approval
    // For simplicity, let's count users with status 'Pending' for now, assuming they need approval.
    const pendingApprovals = await User.countDocuments({ status: 'Pending' }); // Assuming User model has a status field

    res.json({
        totalUsers: { value: totalUsers, change: '+3%' }, // Placeholder change
        activeHospitals: { value: activeHospitals, change: '+1' }, // Placeholder change
        platformRevenue: { value: `₹${platformRevenue.toLocaleString('en-IN')}`, change: '+10%' }, // Placeholder change
        pendingApprovals: { value: pendingApprovals, change: '+2' }, // Placeholder change
    });
});

// @desc    Get user growth data (for chart)
// @route   GET /api/admin/user-growth
// @access  Private/Admin
const getUserGrowthData = asyncHandler(async (req, res) => {
    const userGrowthPatients = await User.aggregate([
        { $match: { role: 'Patient', createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } } }, // Last 12 months
        { $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 }
        } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const userGrowthDoctors = await User.aggregate([
        { $match: { role: 'Doctor', createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } } }, // Last 12 months
        { $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 }
        } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedUserGrowth = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
            month: date.toLocaleString('en-US', { month: 'short' }),
            Patients: 0,
            Doctors: 0,
        };
    }).reverse();

    userGrowthPatients.forEach(data => {
        const monthName = new Date(data._id.year, data._id.month - 1).toLocaleString('en-US', { month: 'short' });
        const monthIndex = formattedUserGrowth.findIndex(item => item.month === monthName);
        if (monthIndex !== -1) {
            formattedUserGrowth[monthIndex].Patients = data.count;
        }
    });

    userGrowthDoctors.forEach(data => {
        const monthName = new Date(data._id.year, data._id.month - 1).toLocaleString('en-US', { month: 'short' });
        const monthIndex = formattedUserGrowth.findIndex(item => item.month === monthName);
        if (monthIndex !== -1) {
            formattedUserGrowth[monthIndex].Doctors = data.count;
        }
    });

    res.json(formattedUserGrowth);
});

// @desc    Get user distribution data (for pie chart)
// @route   GET /api/admin/user-distribution
// @access  Private/Admin
const getUserDistributionData = asyncHandler(async (req, res) => {
    const userDistribution = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);
    res.json(userDistribution);
});

// @desc    Get pending approvals (Doctors and Shops)
// @route   GET /api/admin/pending-approvals
// @access  Private/Admin
const getPendingApprovals = asyncHandler(async (req, res) => {
    const pendingDoctors = await Doctor.find({ isApproved: false }).populate('user', 'name email'); // Assuming isApproved field
    const pendingShops = await Shop.find({ isApproved: false }).populate('user', 'name email'); // Assuming isApproved field

    res.json({
        doctors: pendingDoctors.map(d => ({ id: d._id, name: d.user.name, email: d.user.email, type: 'Doctor' })),
        shops: pendingShops.map(s => ({ id: s._id, name: s.name, email: s.email, type: 'Shop' })),
    });
});

// @desc    Approve a user (Doctor/Shop)
// @route   PUT /api/admin/approve-user/:id
// @access  Private/Admin
const approveUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type } = req.body; // 'Doctor' or 'Shop'

    let entity;
    if (type === 'Doctor') {
        entity = await Doctor.findById(id);
    } else if (type === 'Shop') {
        entity = await Shop.findById(id);
    } else {
        res.status(400);
        throw new Error('Invalid entity type for approval');
    }

    if (!entity) {
        res.status(404);
        throw new Error(`${type} not found`);
    }

    entity.isApproved = true;
    await entity.save();

    // Also update the user's status if needed (e.g., from 'Pending' to 'Active')
    if (entity.user) {
        const user = await User.findById(entity.user);
        if (user) {
            user.status = 'Active'; // Assuming User model has a status field
            await user.save();

            // Notify the approved user
            if (user.phoneNumber) {
                const msg = `Hello ${user.name}, your ${type} profile has been approved! You can now access all features.`;
                sendSms(user.phoneNumber, msg);
            }
            await Notification.create({
                recipient: entity._id,
                onModel: type,
                title: `${type} Profile Approved`,
                message: `Your ${type} profile has been approved! You can now access all features.`, 
                category: 'Approval',
                link: `/${type.toLowerCase()}/dashboard`,
            });
        }
    }

    res.json({ message: `${type} profile approved successfully` });
});

// @desc    Reject a user (Doctor/Shop)
// @route   PUT /api/admin/reject-user/:id
// @access  Private/Admin
const rejectUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type, reason } = req.body; // 'Doctor' or 'Shop'

    let entity;
    if (type === 'Doctor') {
        entity = await Doctor.findById(id);
    } else if (type === 'Shop') {
        entity = await Shop.findById(id);
    } else {
        res.status(400);
        throw new Error('Invalid entity type for rejection');
    }

    if (!entity) {
        res.status(404);
        throw new Error(`${type} not found`);
    }

    // Optionally, delete the profile or mark it as rejected
    await entity.deleteOne(); // Deleting the profile upon rejection

    // Also update the user's status if needed (e.g., from 'Pending' to 'Rejected')
    if (entity.user) {
        const user = await User.findById(entity.user);
        if (user) {
            user.status = 'Rejected'; // Assuming User model has a status field
            await user.save();

            // Notify the rejected user
            if (user.phoneNumber) {
                const msg = `Hello ${user.name}, your ${type} profile application has been rejected. Reason: ${reason || 'No reason provided.'}`; 
                sendSms(user.phoneNumber, msg);
            }
            await Notification.create({
                recipient: entity._id,
                onModel: type,
                title: `${type} Profile Rejected`,
                message: `Your ${type} profile application has been rejected. Reason: ${reason || 'No reason provided.'}`, 
                category: 'Approval',
                link: `/${type.toLowerCase()}/settings`,
            });
        }
    }

    res.json({ message: `${type} profile rejected and removed successfully` });
});

// @desc    Get hospital performance data
// @route   GET /api/admin/hospital-performance
// @access  Private/Admin
const getHospitalPerformance = asyncHandler(async (req, res) => {
    const hospitals = await Hospital.find({}).select('name location');

    const hospitalPerformance = await Promise.all(hospitals.map(async (hospital) => {
        const patientLoad = await Appointment.countDocuments({ hospital: hospital._id, status: { $ne: 'Completed' } });
        const avgWaitTimeResult = await Appointment.aggregate([
            { $match: { hospital: hospital._id, status: 'Completed', createdAt: { $exists: true }, updatedAt: { $exists: true } } },
            { $project: { duration: { $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 60000] } } }, // duration in minutes
            { $group: { _id: null, avgDuration: { $avg: "$duration" } } }
        ]);
        const avgWaitTime = avgWaitTimeResult.length > 0 ? `${avgWaitTimeResult[0].avgDuration.toFixed(1)} mins` : 'N/A';

        const reviews = await Review.find({ reviewedEntity: hospital._id, onModel: 'Hospital' });
        const rating = reviews.length > 0 
            ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
            : 0;

        return {
            name: hospital.name,
            patientLoad: patientLoad > 50 ? 'High' : (patientLoad > 20 ? 'Medium' : 'Low'), // Dummy logic
            avgWaitTime,
            rating,
        };
    }));

    res.json(hospitalPerformance);
});

// --- Admin Profile ---
// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = asyncHandler(async (req, res) => {
    const adminUser = await User.findById(req.user._id); // Assuming req.user is populated by protect middleware

    if (!adminUser || adminUser.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized as admin');
    }

    // Performance Stats (for profile page)
    const usersManagedData = [
        { month: 'Jan', value: 100 }, { month: 'Feb', value: 120 }, { month: 'Mar', value: 150 },
        { month: 'Apr', value: 130 }, { month: 'May', value: 180 }, { month: 'Jun', value: 200 },
    ]; // Dummy data for sparkline
    const approvalsDoneData = [
        { month: 'Jan', value: 10 }, { month: 'Feb', value: 15 }, { month: 'Mar', value: 12 },
        { month: 'Apr', value: 18 }, { month: 'May', value: 20 }, { month: 'Jun', value: 25 },
    ]; // Dummy data for sparkline
    const ticketsResolvedData = [
        { month: 'Jan', value: 5 }, { month: 'Feb', value: 8 }, { month: 'Mar', value: 10 },
        { month: 'Apr', value: 7 }, { month: 'May', value: 12 }, { month: 'Jun', value: 15 },
    ]; // Dummy data for sparkline

    // --- Real data for Performance Stats ---
    const totalUsersManaged = await User.countDocuments({ createdBy: adminUser._id }); // Assuming admin creates users
    const totalApprovalsDone = await Notification.countDocuments({ 
        recipient: adminUser._id, 
        onModel: 'Admin', 
        category: 'Approval', 
        title: { $regex: 'Approved', $options: 'i' } 
    });
    const totalTicketsResolved = await Notification.countDocuments({
        recipient: adminUser._id,
        onModel: 'Admin',
        category: 'Support', // Assuming 'Support' category for tickets
        isRead: true, // Assuming resolved tickets are marked as read
    });

    res.json({
        personalInfo: {
            name: adminUser.name,
            pfp: adminUser.profilePicture || '/uploads/default.jpg',
            role: adminUser.role,
            memberSince: adminUser.createdAt,
        },
        performance: {
            usersManaged: { value: totalUsersManaged, change: '+10%', data: usersManagedData }, // Use real data
            approvalsDone: { value: totalApprovalsDone, change: '+5%', data: approvalsDoneData }, // Use real data
            ticketsResolved: { value: totalTicketsResolved, change: '+7%', data: ticketsResolvedData }, // Use real data
        },
        recentLog: [
            { id: '1', icon: 'UserPlus', action: 'Approved Dr. Sharma\'s profile', timestamp: '2 hours ago' },
            { id: '2', icon: 'ShoppingCart', action: 'Processed order #OR2345', timestamp: '1 day ago' },
            { id: '3', icon: 'AlertTriangle', action: 'Resolved system alert: DB overload', timestamp: '2 days ago' },
        ], // Dummy data
        achievements: [
            { id: '1', icon: 'Award', name: 'Master Approver', description: 'Approved 100+ profiles', achieved: true },
            { id: '2', icon: 'ShieldCheck', name: 'Security Guardian', description: 'Implemented 2FA for all admins', achieved: false },
        ], // Dummy data
    });
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateAdminProfile = asyncHandler(async (req, res) => {
    const { name, profilePicture } = req.body;

    const adminUser = await User.findById(req.user._id);

    if (!adminUser || adminUser.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized as admin');
    }

    if (name !== undefined) {
        adminUser.name = name;
    }
    if (profilePicture !== undefined) {
        adminUser.profilePicture = profilePicture;
    }

    const updatedAdmin = await adminUser.save();

    res.json({
        personalInfo: {
            name: updatedAdmin.name,
            pfp: updatedAdmin.profilePicture,
        },
    });
});

// @desc    Get admin recent log
// @route   GET /api/admin/recent-log
// @access  Private/Admin
const getAdminRecentLog = asyncHandler(async (req, res) => {
    const adminUser = await User.findById(req.user._id); // Assuming req.user is populated by protect middleware

    if (!adminUser || adminUser.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized as admin');
    }

    const recentAdminActions = await Notification.find({ recipient: adminUser._id, onModel: 'Admin' })
                                                .sort({ createdAt: -1 })
                                                .limit(5); // Get latest 5 actions

    const formattedRecentLog = recentAdminActions.map(action => ({
        id: action._id,
        icon: action.icon || 'Info', // Use actual icon from notification or default
        action: action.message, // Use notification message as action description
        timestamp: new Date(action.createdAt).toLocaleString(),
    }));

    res.json(formattedRecentLog);
});

// @desc    Get admin achievements
// @route   GET /api/admin/achievements
// @access  Private/Admin
const getAdminAchievements = asyncHandler(async (req, res) => {
    const adminUser = await User.findById(req.user._id);

    if (!adminUser || adminUser.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized as admin');
    }

    // Calculate achievements based on actual data
    const totalUsersManaged = await User.countDocuments({ createdBy: adminUser._id });
    const totalApprovalsDone = await Notification.countDocuments({ 
        recipient: adminUser._id, 
        onModel: 'Admin', 
        category: 'Approval', 
        title: { $regex: 'Approved', $options: 'i' } 
    });

    const achievements = [
        { id: '1', icon: 'Award', name: 'Master Approver', description: 'Approved 100+ profiles', achieved: totalApprovalsDone >= 100 },
        { id: '2', icon: 'ShieldCheck', name: 'Security Guardian', description: 'Implemented 2FA for all admins', achieved: false }, // 2FA is postponed
        { id: '3', icon: 'UserCheck', name: 'User Manager', description: 'Managed 500+ users', achieved: totalUsersManaged >= 500 },
        { id: '4', icon: 'GitBranch', name: 'Feature Contributor', description: 'Deployed 5+ new features', achieved: false }, // Placeholder for complex logic
    ];

    res.json(achievements);
});

// --- Admin Analytics ---
// @desc    Get admin analytics KPIs (Total Revenue, New User Growth, Avg. Wait Time, Platform Rating)
// @route   GET /api/admin/analytics/kpis
// @access  Private/Admin
const getAdminAnalyticsKpis = asyncHandler(async (req, res) => {
    const totalRevenueResult = await Order.aggregate([
        { $match: { status: 'Delivered', paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const newUserGrowthCount = await User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }); // Last 30 days

    const avgWaitTimeResult = await Appointment.aggregate([
        { $match: { status: 'Completed', createdAt: { $exists: true }, updatedAt: { $exists: true } } },
        { $project: { duration: { $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 60000] } } },
        { $group: { _id: null, avgDuration: { $avg: "$duration" } } }
    ]);
    const avgWaitTime = avgWaitTimeResult.length > 0 ? `${avgWaitTimeResult[0].avgDuration.toFixed(1)} mins` : 'N/A';

    const platformRatingResult = await Review.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const platformRating = platformRatingResult.length > 0 ? platformRatingResult[0].avgRating.toFixed(1) : 0;

    res.json({
        kpis: { // Wrap the object in a 'kpis' key
            totalRevenue: { value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+10%' }, // Placeholder change
            newUserGrowth: { value: newUserGrowthCount, change: '+5%' }, // Placeholder change
            avgWaitTime: { value: avgWaitTime, change: '-2%' }, // Placeholder change
            platformRating: { value: platformRating, change: '+0.1' }, // Placeholder change
        }
    });
});

// @desc    Get admin user growth analysis data (for chart)
// @route   GET /api/admin/analytics/user-growth
// @access  Private/Admin
const getAdminUserGrowthAnalysis = asyncHandler(async (req, res) => {
    const userGrowthPatients = await User.aggregate([
        { $match: { role: 'Patient', createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } } },
        { $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 }
        } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const userGrowthDoctors = await User.aggregate([
        { $match: { role: 'Doctor', createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } } },
        { $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 }
        } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedUserGrowth = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
            month: date.toLocaleString('en-US', { month: 'short' }),
            Patients: 0,
            Doctors: 0,
        };
    }).reverse();

    userGrowthPatients.forEach(data => {
        const monthName = new Date(data._id.year, data._id.month - 1).toLocaleString('en-US', { month: 'short' });
        const monthIndex = formattedUserGrowth.findIndex(item => item.month === monthName);
        if (monthIndex !== -1) {
            formattedUserGrowth[monthIndex].Patients = data.count;
        }
    });

    userGrowthDoctors.forEach(data => {
        const monthName = new Date(data._id.year, data._id.month - 1).toLocaleString('en-US', { month: 'short' });
        const monthIndex = formattedUserGrowth.findIndex(item => item.month === monthName);
        if (monthIndex !== -1) {
            formattedUserGrowth[monthIndex].Doctors = data.count;
        }
    });

    res.json(formattedUserGrowth);
});

// @desc    Get admin revenue streams data (for pie chart)
// @route   GET /api/admin/analytics/revenue-streams
// @access  Private/Admin
const getAdminRevenueStreams = asyncHandler(async (req, res) => {
    // For simplicity, let's assume revenue comes from shop orders and doctor appointments (fees)
    const totalShopRevenueResult = await Order.aggregate([
        { $match: { status: 'Delivered', paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalShopRevenue = totalShopRevenueResult.length > 0 ? totalShopRevenueResult[0].total : 0;

    const totalAppointmentRevenueResult = await Appointment.aggregate([
        { $match: { status: 'Completed', paymentStatus: 'Paid' } }, // Assuming Appointment has paymentStatus
        { $lookup: { from: 'doctors', localField: 'doctor', foreignField: '_id', as: 'doctorInfo' } },
        { $unwind: '$doctorInfo' },
        { $group: { _id: null, total: { $sum: '$doctorInfo.consultationFee' } } }
    ]);
    const totalAppointmentRevenue = totalAppointmentRevenueResult.length > 0 ? totalAppointmentRevenueResult[0].total : 0;

    res.json({ 
        revenueStreams: [
            { name: 'Shop Orders', value: totalShopRevenue },
            { name: 'Appointment Fees', value: totalAppointmentRevenue },
            { name: 'Other Revenue', value: 5000 }, // Placeholder for other revenue streams
        ]
    });
});

// @desc    Get admin top performing hospitals data
// @route   GET /api/admin/analytics/top-hospitals
// @access  Private/Admin
const getAdminTopHospitals = asyncHandler(async (req, res) => {
    const hospitals = await Hospital.find({}).select('name');

    const topHospitals = await Promise.all(hospitals.map(async (hospital) => {
        const totalRevenueResult = await Order.aggregate([
            { $match: { shop: { $in: await Shop.distinct('_id', { affiliatedHospital: hospital._id }) }, status: 'Delivered', paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const revenueContribution = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        const reviews = await Review.find({ reviewedEntity: hospital._id, onModel: 'Hospital' });
        const rating = reviews.length > 0 
            ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
            : 0;

        return {
            name: hospital.name,
            revenue: `₹${revenueContribution.toLocaleString('en-IN')}`,
            rating,
        };
    }));

    // Sort by revenue for top performing
    topHospitals.sort((a, b) => parseFloat(b.revenue.replace('₹', '').replace(/,/g, '')) - parseFloat(a.revenue.replace('₹', '').replace(/,/g, '')));

    res.json(topHospitals.slice(0, 5)); // Top 5 hospitals
});

// --- System Alerts ---
// @desc    Get all system alerts (Admin only)
// @route   GET /api/admin/alerts
// @access  Private/Admin
const getSystemAlerts = asyncHandler(async (req, res) => {
    const alerts = await SystemAlert.find({}).populate('createdBy', 'name email');
    res.json(alerts);
});

// @desc    Create a system alert (Admin only)
// @route   POST /api/admin/alerts
// @access  Private/Admin
const createSystemAlert = asyncHandler(async (req, res) => {
    const { title, message, severity, category, isActive, expiresAt } = req.body;

    const alert = new SystemAlert({
        title,
        message,
        severity: severity || 'Medium',
        category: category || 'System',
        isActive: isActive !== undefined ? isActive : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdBy: req.user._id, // Admin creating the alert
    });

    const createdAlert = await alert.save();
    res.status(201).json(createdAlert);
});

// @desc    Update a system alert (Admin only)
// @route   PUT /api/admin/alerts/:id
// @access  Private/Admin
const updateSystemAlert = asyncHandler(async (req, res) => {
    const { title, message, severity, category, isActive, expiresAt } = req.body;

    const alert = await SystemAlert.findById(req.params.id);

    if (!alert) {
        res.status(404);
        throw new Error('System alert not found');
    }

    alert.title = title ?? alert.title;
    alert.message = message ?? alert.message;
    alert.severity = severity ?? alert.severity;
    alert.category = category ?? alert.category;
    alert.isActive = isActive !== undefined ? isActive : alert.isActive;
    alert.expiresAt = expiresAt ? new Date(expiresAt) : alert.expiresAt;

    const updatedAlert = await alert.save();
    res.json(updatedAlert);
});

// @desc    Delete a system alert (Admin only)
// @route   DELETE /api/admin/alerts/:id
// @access  Private/Admin
const deleteSystemAlert = asyncHandler(async (req, res) => {
    const alert = await SystemAlert.findById(req.params.id);

    if (!alert) {
        res.status(404);
        throw new Error('System alert not found');
    }

    await alert.deleteOne();
    res.json({ message: 'System alert removed successfully' });
});

// @desc    Get security metrics (Admin only)
// @route   GET /api/admin/security/metrics
// @access  Private/Admin
const getSecurityMetrics = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    // Assuming 2FA status is stored on the User model
    const usersWith2FA = await User.countDocuments({ is2FAEnabled: true }); // Assuming `is2FAEnabled` field on User

    const twoFactorAuthEnabledPercentage = totalUsers > 0 ? ((usersWith2FA / totalUsers) * 100).toFixed(0) : 0;

    // For simplicity, a dummy security score. In a real app, this would be complex.
    const securityScore = 85; 

    res.json({
        securityScore,
        twoFactorAuth: {
            enabledPercentage: twoFactorAuthEnabledPercentage,
        },
    });
});

// @desc    Get active sessions (Admin only)
// @route   GET /api/admin/security/active-sessions
// @access  Private/Admin
const getActiveSessions = asyncHandler(async (req, res) => {
    // This is a simplified approach. Real session management would involve session tokens/records.
    // For now, let's return some dummy active sessions or fetch based on recent login activity.
    const recentLoggedInUsers = await User.find({ lastLoginAt: { $exists: true, $gte: new Date(Date.now() - 3600000) } }) // Last 1 hour
                                        .select('name email lastLoginAt ipAddress device');

    const activeSessions = recentLoggedInUsers.map(user => ({
        id: user._id,
        user: user.name,
        email: user.email,
        device: user.device || 'Unknown Device',
        ip: user.ipAddress || 'N/A',
        location: 'Unknown', // Placeholder, would need IP lookup service
        lastActivity: user.lastLoginAt,
    }));

    res.json(activeSessions);
});

// @desc    Revoke a user session (Admin only)
// @route   PUT /api/admin/security/revoke-session/:id
// @access  Private/Admin
const revokeUserSession = asyncHandler(async (req, res) => {
    const { id } = req.params; // User ID

    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // In a real application, you would invalidate the user's JWT or clear their session token.
    // For this example, we'll just clear their lastLoginAt and device/ip to simulate logout.
    user.lastLoginAt = null;
    user.device = null;
    user.ipAddress = null;
    await user.save();

    res.json({ message: 'User session revoked successfully' });
});

// @desc    Get all notifications for admin
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getAdminNotifications = asyncHandler(async (req, res) => {
    const adminUser = await User.findById(req.user._id); // Assuming req.user is populated by protect middleware

    if (!adminUser || adminUser.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized as admin');
    }

    const notifications = await Notification.find({ recipient: adminUser._id, onModel: 'Admin' })
                                                .sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Mark notification as read for admin
// @route   PUT /api/admin/notifications/:id/read
// @access  Private/Admin
const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    // Ensure admin is the recipient of this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to mark this notification as read');
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
});

export { 
    getPlatformKpis,
    getUserGrowthData,
    getUserDistributionData,
    getPendingApprovals,
    approveUser,
    rejectUser,
    getHospitalPerformance,
    getAdminProfile,
    updateAdminProfile,
    getAdminRecentLog,
    getAdminAchievements,
    getAdminAnalyticsKpis,
    getAdminUserGrowthAnalysis,
    getAdminRevenueStreams,
    getAdminTopHospitals,
    getSystemAlerts,
    createSystemAlert,
    updateSystemAlert,
    deleteSystemAlert,
    getSecurityMetrics,
    getActiveSessions,
    revokeUserSession,
    getAdminNotifications,
    markNotificationAsRead,
};
