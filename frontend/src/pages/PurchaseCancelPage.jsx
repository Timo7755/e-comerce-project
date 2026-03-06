import { Link } from "react-router-dom";

export default function PurchaseCancelPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
            Checkout canceled
          </span>
        </h1>

        <p className="mt-3 text-sm text-white/70">
          No worries — your cart is still here.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Back to cart
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Keep browsing
          </Link>
        </div>
      </div>
    </div>
  );
}

