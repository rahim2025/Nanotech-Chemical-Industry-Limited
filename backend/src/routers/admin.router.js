import express from "express";
import { 
    getAllUsers, 
    promoteToAdmin, 
    demoteToUser, 
    getUserById, 
    deleteUser 
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { requireAdmin, requireUserOrAdmin } from "../middlewares/adminAuth.js";

const router = express.Router();

// Admin-only routes
router.get("/users", protectRoute, requireAdmin, getAllUsers);
router.put("/users/:userId/promote", protectRoute, requireAdmin, promoteToAdmin);
router.put("/users/:userId/demote", protectRoute, requireAdmin, demoteToUser);
router.delete("/users/:userId", protectRoute, requireAdmin, deleteUser);

// Routes accessible by user themselves or admin
router.get("/users/:userId", protectRoute, requireUserOrAdmin, getUserById);

export default router;
