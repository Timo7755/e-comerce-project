import { useState } from "react";
import { Ticket, Loader } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";

/**
 * Admin coupon creation form.
 *
 * Creates a global, single-use coupon:
 * - Admin chooses code + discount percentage (+ optional expiration date)
 * - Coupon can be used once at checkout, then it’s redeemed server-side
 */
export default function CreateCouponForm() {
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code,
        discountPercentage: Number(discountPercentage),
        ...(expirationDate ? { expirationDate } : {}),
      };

      const res = await axios.post("/coupons", payload);
      toast.success(`Coupon created: ${res.data.code}`);
      setCode("");
      setDiscountPercentage(10);
      setExpirationDate("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create coupon",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-8 w-full max-w-xl rounded-2xl border border-white/10 bg-black/35 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
          Create Coupon
        </span>
      </h2>
      <p className="mt-1 text-sm text-white/60">
        Create a one-time discount code for checkout.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70">
            Coupon code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SPRING20"
            className="mt-1 block w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 shadow-sm outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
            required
          />
          <p className="mt-1 text-xs text-white/45">
            Stored as uppercase with spaces removed.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">
            Discount %
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="mt-1 block w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">
            Expiration date (optional)
          </label>
          <input
            type="datetime-local"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Creating…
            </>
          ) : (
            <>
              <Ticket className="mr-2 h-5 w-5" />
              Create coupon
            </>
          )}
        </button>
      </form>
    </div>
  );
}

