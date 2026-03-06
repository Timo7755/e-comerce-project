import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { createCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

/**
 * Coupon routes.
 *
 * - Validate is public so guests can use coupon codes at checkout.
 * - Create is admin-only (custom code + discount).
 */
router.post("/validate", validateCoupon);
router.post("/", protectRoute, adminRoute, createCoupon);

export default router;
