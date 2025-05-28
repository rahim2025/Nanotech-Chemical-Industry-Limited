import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

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
app.use(cors({
    origin: "http://31.97.49.55:5173",
    credentials: true,
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

app.use("/api/auth",authRouter)
app.use("/api/admin",adminRouter)
app.use("/api/products",productRouter)
app.use("/api/comments",commentRouter)
app.use("/api/inquiries",inquiryRouter)
app.use("/api/notifications",notificationRouter)

app.get("/", (req, res) => {
  res.send("🚀 Backend is live!");
});


app.listen(5000, '0.0.0.0', () => {
    console.log("Server is running on port 5000");
    connectDB();
});
