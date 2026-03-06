import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

/**
 * Order routes.
 *
 * `/me` is for showing purchase history to the signed-in user.
 */
router.get("/me", protectRoute, getMyOrders);

export default router;

