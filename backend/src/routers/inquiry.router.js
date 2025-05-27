import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
import { 
  createInquiry, 
  getAllInquiries, 
  getInquiryById, 
  updateInquiryStatus 
} from "../controllers/inquiry.controller.js";

const router = express.Router();

// Public route for creating inquiries
router.post("/", createInquiry);

// Admin routes (protected)
router.get("/", protectRoute, requireAdmin, getAllInquiries);
router.get("/:id", protectRoute, requireAdmin, getInquiryById);
router.patch("/:id/status", protectRoute, requireAdmin, updateInquiryStatus);

export default router;
