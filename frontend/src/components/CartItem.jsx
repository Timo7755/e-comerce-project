import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                {item.name}
              </h3>
              <p className="mt-0.5 text-xs text-white/60 sm:text-sm">
                {item.category}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-white/85">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="min-w-10 px-2 text-center text-sm font-semibold text-white/85">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeFromCart(item._id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-rose-200/90 transition hover:border-rose-400/25 hover:bg-rose-400/10 hover:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

