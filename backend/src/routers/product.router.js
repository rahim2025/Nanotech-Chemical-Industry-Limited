import express from "express";
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from "../controllers/product.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { requireAdmin } from "../middlewares/adminAuth.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:productId", getProductById);

// Admin-only routes
router.post("/", protectRoute, requireAdmin, upload.single('photo'), createProduct);
router.put("/:productId", protectRoute, requireAdmin, upload.single('photo'), updateProduct);
router.delete("/:productId", protectRoute, requireAdmin, deleteProduct);

export default router;