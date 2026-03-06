/**
 * Coupon controllers.
 *
 * Coupons are global (admin-created) and single-use:
 * - Anyone can validate/apply a code at checkout
 * - After a successful payment the code is redeemed and can’t be used again
 */
import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;

    const normalizedCode = String(code || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");

    if (!normalizedCode) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const pct = Number(discountPercentage);
    if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
      return res
        .status(400)
        .json({ message: "discountPercentage must be between 1 and 100" });
    }

    const exp = expirationDate ? new Date(expirationDate) : undefined;
    if (exp && Number.isNaN(exp.getTime())) {
      return res.status(400).json({ message: "Invalid expirationDate" });
    }

    const exists = await Coupon.findOne({ code: normalizedCode });
    if (exists) {
      return res.status(409).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      discountPercentage: pct,
      ...(exp ? { expirationDate: exp } : {}),
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.log("error with createCoupon controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const normalizedCode = String(code || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");

    const coupon = await Coupon.findOne({
      code: normalizedCode,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (coupon.isRedeemed) {
      return res.status(400).json({ message: "Coupon already used" });
    }

    res.json({
      message: "Coupon validated successfully",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("error with validateCoupon controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

