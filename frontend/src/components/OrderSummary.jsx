import { useMemo } from "react";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { getStripe } from "../lib/stripe";

/**
 * Cart totals + Stripe checkout trigger.
 *
 * Uses the cart store (guest-friendly local cart) and calls the backend to create
 * a Stripe Checkout Session, then redirects the browser to Stripe.
 */
const OrderSummary = () => {
  const { cart, subtotal, total, coupon } = useCartStore();

  const itemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart],
  );

  const handleCheckout = async () => {
    try {
      if (!cart.length) {
        toast.error("Your cart is empty");
        return;
      }

      const stripe = await getStripe();
      const res = await axios.post("/payments/create-checkout-session", {
        products: cart.map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          image: p.image,
          quantity: p.quantity,
        })),
        couponCode: coupon?.code,
      });

      const { id } = res.data;
      if (!id) throw new Error("Missing Stripe session id");

      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) toast.error(error.message || "Checkout failed");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Checkout failed",
      );
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <h3 className="text-base font-semibold text-white">Order summary</h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between text-white/75">
          <span>Items</span>
          <span>{itemsCount}</span>
        </div>
        <div className="flex items-center justify-between text-white/75">
          <span>Subtotal</span>
          <span>${Number(subtotal || 0).toFixed(2)}</span>
        </div>
        {coupon ? (
          <div className="flex items-center justify-between text-white/75">
            <span>Discount</span>
            <span>-{coupon.discountPercentage}%</span>
          </div>
        ) : null}
        <div className="h-px bg-white/10" />
        <div className="flex items-center justify-between text-white">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">${Number(total || 0).toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
      >
        Checkout
      </button>
    </div>
  );
};

export default OrderSummary;

