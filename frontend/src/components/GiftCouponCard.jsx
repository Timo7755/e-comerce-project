import { useState } from "react";
import { Tag } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

/**
 * Coupon UI.
 *
 * Coupons are global and single-use (admin-created):
 * - Anyone can apply a code
 * - Codes are redeemed after successful payment
 */
const GiftCouponCard = () => {
  useUserStore((s) => s.user);
  const { coupon, applyCoupon, removeCoupon, isCouponApplied } = useCartStore();
  const [code, setCode] = useState("");

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-white/70" />
        <h3 className="text-base font-semibold text-white">Coupon</h3>
      </div>

      {isCouponApplied && coupon ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/80">
            Applied: <span className="font-semibold">{coupon.code}</span> (
            {coupon.discountPercentage}% off)
          </p>
          <button
            type="button"
            onClick={removeCoupon}
            className="mt-3 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Remove coupon
          </button>
        </div>
      ) : (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!code.trim()) return;
            applyCoupon(code.trim());
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
};

export default GiftCouponCard;

