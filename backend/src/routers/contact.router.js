import express from 'express';
import {
    createContactMessage,
    getAllContactMessages,
    getContactMessageById,
    updateContactMessageStatus,
    markContactAsRead,
    deleteContactMessage
} from '../controllers/contact.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { requireAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();

// Public route - create contact message
router.post('/', createContactMessage);

// Admin routes - require authentication and admin role
router.get('/admin', protectRoute, requireAdmin, getAllContactMessages);
router.get('/admin/:id', protectRoute, requireAdmin, getContactMessageById);
router.patch('/admin/:id/status', protectRoute, requireAdmin, updateContactMessageStatus);
router.patch('/admin/:id/read', protectRoute, requireAdmin, markContactAsRead);
router.delete('/admin/:id', protectRoute, requireAdmin, deleteContactMessage);

export default router;
