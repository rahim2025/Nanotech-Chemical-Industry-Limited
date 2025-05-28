import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationStats
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get user's notifications
router.get("/", protectRoute, getUserNotifications);

// Mark specific notification as read
router.patch("/:notificationId/read", protectRoute, markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", protectRoute, markAllNotificationsAsRead);

// Delete notification (admin only)
router.delete("/:notificationId", protectRoute, requireAdmin, deleteNotification);

// Get notification statistics (admin only)
router.get("/stats", protectRoute, requireAdmin, getNotificationStats);

export default router;
