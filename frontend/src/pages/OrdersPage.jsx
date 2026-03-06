import { useEffect, useMemo, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const res = await axios.get("/orders/me");
        if (!cancelled) setOrders(res.data.orders || []);
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load orders",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasOrders = orders.length > 0;

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
              Purchase history
            </span>
          </h1>
          <p className="mt-2 text-sm text-white/65">
            Your past checkouts — saved to your account.
          </p>
        </div>

        {hasOrders ? (
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 backdrop-blur-md">
            Total spent:{" "}
            <span className="font-semibold text-white">
              €{totalSpent.toFixed(2)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-white/70 backdrop-blur-md">
            Loading your orders…
          </div>
        ) : !hasOrders ? (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-white/70 backdrop-blur-md">
            No orders yet. Your next drop is waiting.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-white/70">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : "—"}
                    </p>
                    <p className="mt-1 text-sm text-white/60 break-all">
                      Session:{" "}
                      <span className="text-white/75">{o.stripeSessionId}</span>
                    </p>
                  </div>
                  <div className="text-sm text-white">
                    Total:{" "}
                    <span className="font-semibold">
                      €{Number(o.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {Array.isArray(o.products) ? (
                    o.products.map((p, idx) => (
                      <div
                        key={`${o._id}-${idx}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {p?.product?.name || "Item"}
                          </p>
                          <p className="mt-0.5 text-xs text-white/60">
                            Qty {p.quantity} · €{Number(p.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="shrink-0 text-white/80">
                          €{Number((p.price || 0) * (p.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/60">No items</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

