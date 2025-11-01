import express from 'express';
const router = express.Router();
import {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
  onboardHospital,
  getHospitalProfile,
  updateHospitalProfile,
  updateHospitalStatus,
  getHospitalDashboardSummary,
  getHospitalPatients, // NEW: Import getHospitalPatients
  getHospitalDoctors, // NEW: Import getHospitalDoctors
  getHospitalJobPostings, // NEW: Import getHospitalJobPostings
  getHospitalRoles, // NEW: Import getHospitalRoles
  getHospitalAIAssignment, // NEW: Import getHospitalAIAssignment
  getHospitalTokenSystem, // NEW: Import getHospitalTokenSystem
  getHospitalLabTests, // NEW: Import getHospitalLabTests
  getHospitalBloodBank, // NEW: Import getHospitalBloodBank
  getHospitalInsuranceIntegrations, // NEW: Import getHospitalInsuranceIntegrations
  getHospitalPharmacyPartners, // NEW: Import getHospitalPharmacyPartners
  addHospitalPharmacyPartner, // NEW: Import addHospitalPharmacyPartner
  getHospitalPatientFeedback, // NEW: Import getHospitalPatientFeedback
  getHospitalFraudIncidents, // NEW: Import getHospitalFraudIncidents
  getHospitalStockLevels, // NEW: Import getHospitalStockLevels
  getHospitalNotifications, // NEW: Import getHospitalNotifications
} from '../controllers/hospitalController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import multer from 'multer'; // NEW: Import multer for file uploads
import path from 'path'; // NEW: Import path for file handling

const upload = multer({ // NEW: Multer configuration for image uploads
    dest: 'uploads/', // Files will be saved in the 'uploads/' directory
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

router.route('/').get(getHospitals).post(protect, authorizeRoles('Admin'), createHospital);
router.post('/onboard', protect, authorizeRoles('Hospital'), onboardHospital);
router.route('/profile').get(protect, authorizeRoles('Hospital'), getHospitalProfile).put(protect, authorizeRoles('Hospital'), upload.single('image'), updateHospitalProfile); // NEW: Add upload.single('image') middleware
router.route('/dashboard-summary').get(protect, authorizeRoles('Hospital'), getHospitalDashboardSummary);
router.route('/patients').get(protect, authorizeRoles('Hospital'), getHospitalPatients); // NEW: Get all patients for a hospital
router.route('/doctors').get(protect, authorizeRoles('Hospital'), getHospitalDoctors); // NEW: Get doctors for a hospital
router.route('/job-postings').get(protect, authorizeRoles('Hospital'), getHospitalJobPostings); // NEW: Get job postings for a hospital
router.route('/roles').get(protect, authorizeRoles('Hospital'), getHospitalRoles); // NEW: Get roles for a hospital
router.route('/ai-assignment').get(protect, authorizeRoles('Hospital'), getHospitalAIAssignment); // NEW: Get AI assignment for a hospital
router.route('/token-system').get(protect, authorizeRoles('Hospital'), getHospitalTokenSystem); // NEW: Get token system status for a hospital
router.route('/lab-tests').get(protect, authorizeRoles('Hospital'), getHospitalLabTests); // NEW: Get lab tests for a hospital
router.route('/blood-bank').get(protect, authorizeRoles('Hospital'), getHospitalBloodBank); // NEW: Get blood bank data for a hospital
router.route('/insurance-integrations').get(protect, authorizeRoles('Hospital'), getHospitalInsuranceIntegrations); // NEW: Get insurance integrations for a hospital
router.route('/pharmacy-partners').get(protect, authorizeRoles('Hospital'), getHospitalPharmacyPartners).post(protect, authorizeRoles('Hospital'), addHospitalPharmacyPartner); // NEW: Get and add pharmacy partners
router.route('/patient-feedback').get(protect, authorizeRoles('Hospital'), getHospitalPatientFeedback); // NEW: Get patient feedback data
router.route('/fraud-incidents').get(protect, authorizeRoles('Hospital'), getHospitalFraudIncidents); // NEW: Get fraud incidents data
router.route('/stock-levels').get(protect, authorizeRoles('Hospital'), getHospitalStockLevels); // NEW: Get stock levels data
router.route('/notifications').get(protect, authorizeRoles('Hospital'), getHospitalNotifications); // NEW: Get notifications for a hospital
router
  .route('/:id')
  .get(getHospitalById)
  .put(protect, authorizeRoles('Admin'), updateHospital)
  .delete(protect, authorizeRoles('Admin', 'Hospital'), deleteHospital);
router.route('/:id/status').put(protect, authorizeRoles('Admin'), updateHospitalStatus);

export default router;
