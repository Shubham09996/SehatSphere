import express from 'express';
const router = express.Router();
import {
  getShopInventories,
  getShopInventoryById,
  createShopInventory,
  updateShopInventory,
  deleteShopInventory,
  getShopMedicines,
} from '../controllers/shopInventoryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Shop'), getShopInventories).post(protect, authorizeRoles('Admin', 'Shop'), createShopInventory);
router.route('/shop/:shopId').get(getShopMedicines);
router
  .route('/:id')
  .get(getShopInventoryById)
  .put(protect, authorizeRoles('Admin', 'Shop'), updateShopInventory)
  .delete(protect, authorizeRoles('Admin', 'Shop'), deleteShopInventory);

export default router;
