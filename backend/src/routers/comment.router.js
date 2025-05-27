import express from "express";
import { 
    createComment,
    getProductComments,
    replyToComment,
    deleteComment,
    getAllComments,
    toggleCommentApproval
} from "../controllers/comment.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Optional authentication middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            // No token provided, continue without authentication
            req.user = null;
            return next();
        }

        // Try to verify token
        const decoded = jwt.verify(token, process.env.secret);
        if (!decoded) {
            req.user = null;
            return next();
        }

        // Try to find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            req.user = null;
            return next();
        }

        // Set user if found
        req.user = user;
        next();
    } catch (error) {
        // Any error in authentication, continue without user
        req.user = null;
        next();
    }
};

// Public routes (can be accessed by anyone)
router.get("/product/:productId", getProductComments);

// Routes for both logged-in and non-logged-in users
router.post("/product/:productId", optionalAuth, createComment);

// Admin-only routes
router.get("/", protectRoute, requireAdmin, getAllComments);
router.post("/:commentId/reply", protectRoute, requireAdmin, replyToComment);
router.delete("/:commentId", protectRoute, requireAdmin, deleteComment);
router.patch("/:commentId/toggle-approval", protectRoute, requireAdmin, toggleCommentApproval);

export default router;