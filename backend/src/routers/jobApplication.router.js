import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protectRoute } from '../middlewares/protectRoute.js';
import { requireAdmin } from '../middlewares/adminAuth.js';
import {
    submitApplication,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
    getMyApplications
} from '../controllers/jobApplication.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads/applications');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume') {
        // Only allow PDF, DOC, DOCX for resume
        const allowedTypes = ['application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for resume. Only PDF, DOC, and DOCX are allowed.'), false);
        }
    } else if (file.fieldname === 'portfolio') {
        // Allow various file types for portfolio
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif',
            'application/zip', 'application/x-zip-compressed'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for portfolio.'), false);
        }
    } else {
        cb(new Error('Unexpected field'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Public routes
router.post('/submit', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'portfolio', maxCount: 1 }
]), submitApplication);

// Protected routes (require login)
router.get('/my-applications', protectRoute, getMyApplications);

// Admin routes
router.get('/', protectRoute, requireAdmin, getApplications);
router.get('/:id', protectRoute, requireAdmin, getApplicationById);
router.put('/:id/status', protectRoute, requireAdmin, updateApplicationStatus);
router.delete('/:id', protectRoute, requireAdmin, deleteApplication);

export default router;
