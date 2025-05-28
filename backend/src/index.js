import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import http from 'http';
import https from 'https';
import fs from 'fs';

import authRouter from "./routers/auth.router.js"
import adminRouter from "./routers/admin.router.js"
import productRouter from "./routers/product.router.js"
import commentRouter from "./routers/comment.router.js"
import inquiryRouter from "./routers/inquiry.router.js"
import notificationRouter from "./routers/notification.router.js"
import {connectDB} from "./lib/db.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

// Middleware
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// CORS configuration
const allowedOrigins = [
    "https://www.nanotechchemical.com",
    "https://nanotechchemical.com"
];

// In development mode, accept localhost origins
if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push("http://localhost:5173");
    allowedOrigins.push("http://localhost:3000");
}

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if(!origin) return callback(null, true);
        
        console.log("Request from origin:", origin);
        
        if(allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the specific origin
        } else {
            // In production, reject non-allowed origins
            if (process.env.NODE_ENV === 'production') {
                console.log("Origin rejected in production mode:", origin);
                return callback(new Error('CORS not allowed'), false);
            } else {
                console.log("Origin not in allowed list, but allowing in development:", origin);
                callback(null, true);
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie']
}))


// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 10MB.'
            });
        }
    }
    
    if (error.message === 'Only image files (JPEG, PNG, GIF, WebP) are allowed!') {
        return res.status(400).json({
            message: error.message
        });
    }
    
    next(error);
});

// Add a simple test endpoint to verify CORS is working
app.get('/api/cors-test', (req, res) => {
    res.json({ message: 'CORS is working correctly' });
});

app.use("/api/auth",authRouter)
app.use("/api/admin",adminRouter)
app.use("/api/products",productRouter)
app.use("/api/comments",commentRouter)
app.use("/api/inquiries",inquiryRouter)
app.use("/api/notifications",notificationRouter)

// Global error handler that preserves CORS headers
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    
    // Send appropriate error response while preserving CORS headers
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});


const PORT = process.env.PORT || 5000;

// For production setup
if (process.env.NODE_ENV === 'production') {
    try {
        // Check if SSL certificates exist for HTTPS
        const sslOptions = {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH)
        };

        // Create and start HTTPS server with SSL
        const httpsServer = https.createServer(sslOptions, app);
        httpsServer.listen(PORT, () => {
            console.log(`HTTPS Server running on port ${PORT} (production mode)`);
            connectDB();
        });

        // Optional: Redirect HTTP to HTTPS
        // This creates a simple HTTP server that redirects all traffic to HTTPS
        const httpRedirectApp = express();
        httpRedirectApp.use((req, res) => {
            res.redirect(`https://${req.hostname}${req.url}`);
        });
        http.createServer(httpRedirectApp).listen(80, () => {
            console.log('HTTP redirect server running on port 80');
        });
    } catch (error) {
        console.error('Failed to start HTTPS server:', error.message);
        console.log('Check your SSL certificate paths in .env file');
        process.exit(1);
    }
} else {
    // For development
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
        console.log(`HTTP Server running on port ${PORT} (${process.env.NODE_ENV} mode)`);
        connectDB();
    });
}
