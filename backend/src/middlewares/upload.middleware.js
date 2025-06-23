import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent uploads directory outside project (won't be affected by git updates)
const PERSISTENT_UPLOADS_PATH = '/var/uploads/nanotech-chemical';

// Create upload directories if they don't exist
const createUploadDir = (category) => {
    // Use persistent path instead of project path
    const uploadDir = path.join(PERSISTENT_UPLOADS_PATH, category);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Configure storage factory
const createStorage = (category) => multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = createUploadDir(category);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
        cb(null, fileName);
    }
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
    }
};

// Create upload middleware for different categories
const createUploadMiddleware = (category) => multer({
    storage: createStorage(category),
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Default upload middleware for products
const upload = createUploadMiddleware('products');

// Export specific upload middlewares
export const uploadProduct = createUploadMiddleware('products');
export const uploadProfile = createUploadMiddleware('profiles');

// Helper function to delete file
export const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Helper function to get file path from URL
export const getFilePathFromUrl = (imageUrl, baseUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) return null;
    
    const relativePath = imageUrl.split('/uploads/')[1];
    return path.join(PERSISTENT_UPLOADS_PATH, relativePath);
};

export default upload;
