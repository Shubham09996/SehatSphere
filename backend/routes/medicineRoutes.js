import express from 'express';
import { 
    searchMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine
} from '../controllers/medicineController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for searching and getting medicine details
router.route('/').get(searchMedicines);
router.route('/:id').get(getMedicineById);

// Admin routes for managing medicines (create, update, delete)
router.route('/').post(protect, authorizeRoles('Admin'), createMedicine);
router.route('/:id').put(protect, authorizeRoles('Admin'), updateMedicine);
router.route('/:id').delete(protect, authorizeRoles('Admin'), deleteMedicine);

export default router;
