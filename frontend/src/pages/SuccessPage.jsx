import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState("processing"); // processing | ok | error

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        await axios.post("/payments/checkout-success", { sessionId });
        await clearCart();
        if (!cancelled) setStatus("ok");
      } catch (err) {
        toast.error(
          err?.response?.data?.message || err?.message || "Could not confirm payment",
        );
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
            {status === "ok" ? "Order confirmed" : "Checkout status"}
          </span>
        </h1>

        <p className="mt-3 text-sm text-white/70">
          {status === "processing"
            ? "Hang tight — we’re confirming your payment."
            : status === "ok"
              ? "You’re all set. Thanks for thrifting the drop."
              : "We couldn’t confirm your payment. If you were charged, contact support with your session id."}
        </p>

        {sessionId ? (
          <p className="mt-3 text-xs text-white/50 break-all">
            Session: {sessionId}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Back to home
          </Link>
          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}

