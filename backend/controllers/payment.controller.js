/**
 * Stripe checkout controllers.
 *
 * This app allows guest checkout (no account required).
 * Coupons are admin-created and single-use (redeemed after a successful payment).
 * When a user is logged in, we attach metadata so we can create an Order record.
 */
import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/stripe.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    const userId = req.user?._id;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // for stripe we need to use cents
      totalAmount += amount * product.quantity;

      const maybeImage =
        typeof product.image === "string" && /^https?:\/\//.test(product.image)
          ? product.image
          : null;

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            ...(maybeImage ? { images: [maybeImage] } : {}),
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    let coupon = null;
    const normalizedCouponCode = String(couponCode || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");

    if (normalizedCouponCode) {
      coupon = await Coupon.findOne({
        code: normalizedCouponCode,
        isActive: true,
        isRedeemed: false,
      });

      if (coupon) {
        if (coupon.expirationDate < new Date()) {
          coupon.isActive = false;
          await coupon.save();
          coupon = null;
        } else {
          totalAmount -= Math.round(
            (totalAmount * coupon.discountPercentage) / 100,
          );
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: userId ? userId.toString() : "",
        couponCode: coupon?.code || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          })),
        ),
      },
    });

    res.status(200).json({
      id: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    console.log("error with createCheckoutSession controller", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            isActive: true,
            isRedeemed: false,
          },
          {
            isActive: false,
            isRedeemed: true,
            redeemedAt: new Date(),
          },
        );
      }

      if (session.metadata.userId) {
        // create a new order (only for signed-in users; guests can checkout but won't have history)
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
          user: session.metadata.userId,
          products: products.map((p) => ({
            product: p.id,
            quantity: p.quantity,
            price: p.price,
          })),
          totalAmount: session.amount_total / 100, // convert from cents to euros
          stripeSessionId: session.id,
        });

        await newOrder.save();

        return res.status(200).json({
          success: true,
          message: "Order created successfully",
          orderId: newOrder._id,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment received",
      });
    }
  } catch (error) {
    console.log("error with checkout-success route", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
