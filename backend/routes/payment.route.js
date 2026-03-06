import express from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { checkoutSuccess } from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * Payment routes.
 *
 * These are public so guests can checkout.
 * Member-only behavior (coupons + order history) is handled inside controllers
 * when `req.user` exists.
 */
// Public: allow guest checkout
router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout-success", checkoutSuccess);

export default router;
