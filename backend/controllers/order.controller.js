/**
 * Order controllers (member-only).
 *
 * Guests can checkout, but only logged-in users get saved order history.
 */
import Order from "../models/order.model.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.product")
      .lean();

    res.json({ orders });
  } catch (error) {
    console.log("error with getMyOrders controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

