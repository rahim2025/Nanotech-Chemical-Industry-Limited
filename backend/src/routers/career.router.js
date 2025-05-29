import express from 'express';
import {
    getCareers,
    getAllCareersAdmin,
    getCareerById,
    createCareer,
    updateCareer,
    deleteCareer,
    toggleCareerStatus
} from '../controllers/career.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { requireAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getCareers);
router.get('/:id', getCareerById);

// Admin routes - require authentication and admin role
router.get('/admin/all', protectRoute, requireAdmin, getAllCareersAdmin);
router.post('/', protectRoute, requireAdmin, createCareer);
router.put('/:id', protectRoute, requireAdmin, updateCareer);
router.delete('/:id', protectRoute, requireAdmin, deleteCareer);
router.patch('/:id/toggle-status', protectRoute, requireAdmin, toggleCareerStatus);

export default router;
