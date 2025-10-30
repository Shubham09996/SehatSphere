import express from 'express';
const router = express.Router();
import {
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
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// Dashboard Routes
router.route('/kpis').get(protect, authorizeRoles('Admin'), getPlatformKpis);
router.route('/user-growth').get(protect, authorizeRoles('Admin'), getUserGrowthData);
router.route('/user-distribution').get(protect, authorizeRoles('Admin'), getUserDistributionData);
router.route('/pending-approvals').get(protect, authorizeRoles('Admin'), getPendingApprovals);
router.route('/approve-user/:id').put(protect, authorizeRoles('Admin'), approveUser);
router.route('/reject-user/:id').put(protect, authorizeRoles('Admin'), rejectUser);
router.route('/hospital-performance').get(protect, authorizeRoles('Admin'), getHospitalPerformance);

// Profile Routes
router.route('/profile').get(protect, authorizeRoles('Admin'), getAdminProfile);
router.route('/profile').put(protect, authorizeRoles('Admin'), updateAdminProfile);
router.route('/recent-log').get(protect, authorizeRoles('Admin'), getAdminRecentLog);
router.route('/achievements').get(protect, authorizeRoles('Admin'), getAdminAchievements);

// Analytics Routes
router.route('/analytics/kpis').get(protect, authorizeRoles('Admin'), getAdminAnalyticsKpis);
router.route('/analytics/user-growth').get(protect, authorizeRoles('Admin'), getAdminUserGrowthAnalysis);
router.route('/analytics/revenue-streams').get(protect, authorizeRoles('Admin'), getAdminRevenueStreams);
router.route('/analytics/top-hospitals').get(protect, authorizeRoles('Admin'), getAdminTopHospitals);

// NEW: System Alerts Routes
router.route('/alerts')
    .get(protect, authorizeRoles('Admin'), getSystemAlerts)
    .post(protect, authorizeRoles('Admin'), createSystemAlert);

router.route('/alerts/:id')
    .put(protect, authorizeRoles('Admin'), updateSystemAlert)
    .delete(protect, authorizeRoles('Admin'), deleteSystemAlert);

// NEW: Security Routes
router.route('/security/metrics').get(protect, authorizeRoles('Admin'), getSecurityMetrics);
router.route('/security/active-sessions').get(protect, authorizeRoles('Admin'), getActiveSessions);
router.route('/security/revoke-session/:id').put(protect, authorizeRoles('Admin'), revokeUserSession);

// NEW: Admin Notifications Routes
router.route('/notifications').get(protect, authorizeRoles('Admin'), getAdminNotifications);
router.route('/notifications/:id/read').put(protect, authorizeRoles('Admin'), markNotificationAsRead);

export default router;
