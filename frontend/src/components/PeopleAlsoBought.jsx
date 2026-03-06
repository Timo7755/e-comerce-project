import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";

const PeopleAlsoBought = () => {
  const { fetchAllProducts, products, loading } = useProductStore();

  useEffect(() => {
    // Lightweight placeholder: reuse existing products list if available.
    // You can later swap this to a dedicated recommendations endpoint.
    if (!products.length) fetchAllProducts();
  }, [fetchAllProducts, products.length]);

  if (loading) return null;

  return (
    <div className="mt-10">
      <h3 className="text-base font-semibold text-white/90">People also bought</h3>
      <p className="mt-1 text-sm text-white/60">
        Similar vibes you might like.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {products.slice(0, 4).map((p) => (
          <div
            key={p._id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                <p className="text-xs text-white/60">${Number(p.price).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;

