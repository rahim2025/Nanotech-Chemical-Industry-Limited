import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileService {    constructor() {
        this.uploadsDir = path.join(__dirname, '../../uploads');
        this.productsDir = path.join(this.uploadsDir, 'products');
        this.profilesDir = path.join(this.uploadsDir, 'profiles');
        this.ensureDirectoriesExist();
    }

    ensureDirectoriesExist() {
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
        if (!fs.existsSync(this.productsDir)) {
            fs.mkdirSync(this.productsDir, { recursive: true });
        }
        if (!fs.existsSync(this.profilesDir)) {
            fs.mkdirSync(this.profilesDir, { recursive: true });
        }
    }

    // Generate file URL from filename
    generateFileUrl(req, filename, category = 'products') {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return `${baseUrl}/uploads/${category}/${filename}`;
    }

    // Extract filename from URL
    getFilenameFromUrl(imageUrl) {
        if (!imageUrl || !imageUrl.includes('/uploads/')) return null;
        
        const urlParts = imageUrl.split('/');
        return urlParts[urlParts.length - 1];
    }

    // Get full file path from filename
    getFilePath(filename, category = 'products') {
        return path.join(this.uploadsDir, category, filename);
    }

    // Delete file by filename
    deleteFile(filename, category = 'products') {
        try {
            const filePath = this.getFilePath(filename, category);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    // Delete file by URL
    deleteFileByUrl(imageUrl) {
        const filename = this.getFilenameFromUrl(imageUrl);
        if (filename) {
            return this.deleteFile(filename);
        }
        return false;
    }

    // Check if file exists
    fileExists(filename, category = 'products') {
        const filePath = this.getFilePath(filename, category);
        return fs.existsSync(filePath);
    }

    // Get file stats
    getFileStats(filename, category = 'products') {
        try {
            const filePath = this.getFilePath(filename, category);
            return fs.statSync(filePath);
        } catch (error) {
            return null;
        }
    }
}

export default new FileService();
