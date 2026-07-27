import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import http from 'http';

// Load .env from this file's directory explicitly — process.cwd() is unreliable
// under pm2 (it runs with the project root as cwd, not backend/), which previously
// caused MONGO_URI to silently resolve to undefined.
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });
import authRouter from "./routers/auth.router.js"
import adminRouter from "./routers/admin.router.js"
import productRouter from "./routers/product.router.js"
import commentRouter from "./routers/comment.router.js"
import inquiryRouter from "./routers/inquiry.router.js"
import notificationRouter from "./routers/notification.router.js"
import careerRouter from "./routers/career.router.js"
import jobApplicationRouter from "./routers/jobApplication.router.js"
import contactRouter from "./routers/contact.router.js"
import {connectDB} from "./lib/db.js"
import Product from "./models/product.model.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(cookieParser())
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ limit: '15mb', extended: true }))

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

console.log("CORS allowedOrigins:", allowedOrigins);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Single, comprehensive CORS middleware that works with all browsers including Brave
app.use(cors({
    origin: function(origin, callback) {
        // Only log when there's an actual origin (reduces noise)
        if (origin) {
            console.log("CORS: Request from origin:", origin);
        }
        
        // Allow requests with no origin (same-origin requests, mobile apps, curl requests, etc.)
        if (!origin) {
            return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            console.log("CORS: Origin allowed:", origin);
            return callback(null, true); // Let cors middleware handle the origin properly
        }
        
        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            console.log("CORS: Development mode, allowing origin:", origin);
            return callback(null, true);
        }
        
        // In production, reject non-allowed origins
        console.log("CORS: Origin rejected in production mode:", origin);
        return callback(new Error('CORS policy: Origin not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept', 
        'Origin', 
        'Cache-Control', 
        'X-Forwarded-For',
        'pragma',
        'Pragma',
        'User-Agent',
        'DNT',
        'If-Modified-Since',
        'Keep-Alive',
        'If-None-Match',
        'Accept-Encoding',
        'Accept-Language',
        'Connection'
    ],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200,
    maxAge: 86400, // 24 hours cache for preflight - helps with consistency
    preflightContinue: false
}));

// Anti-cache middleware specifically for Brave browser compatibility
app.use((req, res, next) => {
    // Force fresh CORS responses for all browsers, especially Brave
    if (req.method === 'OPTIONS') {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate, private');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        res.header('Vary', 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    }
    next();
});

// Debug middleware to log requests and CORS headers (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        // Only log API requests and important routes
        if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
            console.log(`${req.method} ${req.path} from origin: ${req.headers.origin || 'no-origin'}`);
        }
        
        // Log request headers for debugging preflight requests only
        if (req.method === 'OPTIONS' && req.headers.origin) {
            console.log('Preflight request headers:', {
                'access-control-request-method': req.headers['access-control-request-method'],
                'access-control-request-headers': req.headers['access-control-request-headers'],
                'origin': req.headers.origin
            });
        }
        
        next();
    });
}

// Serve static files from persistent uploads directory (outside project)
app.use('/uploads', express.static('/var/uploads/nanotech-chemical'));

// Multer error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 15MB.'
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

// Import routers
app.use("/api/auth",authRouter)
app.use("/api/admin",adminRouter)
app.use("/api/products",productRouter)
app.use("/api/comments",commentRouter)
app.use("/api/inquiries",inquiryRouter)
app.use("/api/notifications",notificationRouter)
app.use("/api/careers",careerRouter)
app.use("/api/job-applications",jobApplicationRouter)
app.use("/api/contact",contactRouter)

// Dynamic sitemap — includes every product currently in the database so
// search engines can discover and index product pages directly, instead of
// only finding them by crawling links from the homepage.
app.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = "https://nanotechchemical.com";
        const today = new Date().toISOString().split('T')[0];

        const staticPages = [
            { loc: `${baseUrl}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
            { loc: `${baseUrl}/about`, lastmod: today, changefreq: "monthly", priority: "0.8" },
            { loc: `${baseUrl}/contact`, lastmod: today, changefreq: "monthly", priority: "0.7" },
            { loc: `${baseUrl}/careers`, lastmod: today, changefreq: "weekly", priority: "0.6" },
        ];

        const products = await Product.find({}, "_id updatedAt").lean();

        const productPages = products.map((product) => ({
            loc: `${baseUrl}/products/${product._id}`,
            lastmod: new Date(product.updatedAt).toISOString().split('T')[0],
            changefreq: "weekly",
            priority: "0.7",
        }));

        const urlEntries = [...staticPages, ...productPages]
            .map((page) => `  <url>\n    <loc>${page.loc}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`)
            .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
});

// Global error handler that preserves CORS headers
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    
    // Send appropriate error response while preserving CORS headers
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

const PORT = process.env.PORT || 5000;

// Start HTTP server - SSL is handled by Nginx + Certbot
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
    console.log('SSL/HTTPS is handled by Nginx with Certbot certificates');
    connectDB();
});
