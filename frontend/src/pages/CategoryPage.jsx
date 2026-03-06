import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";

const CategoryPage = () => {
  const { category } = useParams();
  const { fetchProductsByCategory, products, loading } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (!category) return;
    fetchProductsByCategory(category);
  }, [category, fetchProductsByCategory]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
            {category}
          </span>
        </h1>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Browse curated secondhand finds in this category.
        </p>
      </div>

      <div className="mt-12">
        {loading ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-white/70 backdrop-blur-md">
            Loading products…
          </div>
        ) : products?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p._id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-fuchsia-400/25 hover:bg-white/10"
              >
                <Link to={`/product/${p._id}`} className="block">
                  <div className="relative aspect-[16/10] w-full">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18)_0%,rgba(236,72,153,0.10)_42%,rgba(0,0,0,0.0)_70%)] opacity-90" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.10)_55%,rgba(0,0,0,0.0)_100%)]" />
                  {p.images?.[0] || p.image ? (
                    <img
                      src={p.images?.[0] || p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-300 group-hover:opacity-95"
                    />
                  ) : null}
                  </div>
                </Link>

                <div className="space-y-1 px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="truncate text-base font-semibold tracking-tight text-white">
                      <Link to={`/product/${p._id}`} className="hover:underline">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="shrink-0 text-sm font-semibold text-white/80">
                      {typeof p.price === "number" ? `$${p.price.toFixed(2)}` : p.price}
                    </p>
                  </div>
                  <p className="line-clamp-2 text-sm text-white/60">
                    {p.description}
                  </p>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className="inline-flex w-full items-center justify-center rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-white/70 backdrop-blur-md">
            No products found in this category yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
