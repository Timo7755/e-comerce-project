import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";

/**
 * Product detail page.
 *
 * Shows a single listing with a small image gallery (thumbnails) when the product
 * has multiple images. Works for legacy products that only have `image`.
 */
function getGallery(product) {
  const imgs = Array.isArray(product?.images) ? product.images : [];
  const legacy = product?.image ? [product.image] : [];
  return [...new Set([...imgs, ...legacy])].filter(Boolean);
}

export default function ProductPage() {
  const { id } = useParams();
  const { currentProduct, fetchProductById, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id);
  }, [id, fetchProductById]);

  const gallery = useMemo(() => getGallery(currentProduct), [currentProduct]);
  const active = gallery[activeIdx] || gallery[0] || "";

  if (loading && !currentProduct) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-white/70 backdrop-blur-md">
          Loading listing…
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-white/70 backdrop-blur-md">
          Listing not found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-[16/11] w-full">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18)_0%,rgba(236,72,153,0.10)_42%,rgba(0,0,0,0.0)_70%)] opacity-90" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.10)_55%,rgba(0,0,0,0.0)_100%)]" />
              {active ? (
                <img
                  src={active}
                  alt={currentProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>
          </div>

          {gallery.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {gallery.slice(0, 10).map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`overflow-hidden rounded-xl border bg-white/5 transition ${
                    idx === activeIdx
                      ? "border-fuchsia-400/35"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Thumb ${idx + 1}`}
                    className="h-16 w-full object-cover opacity-90"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
              {currentProduct.name}
            </span>
          </h1>
          <p className="mt-2 text-sm text-white/60">{currentProduct.category}</p>

          <p className="mt-5 text-sm leading-relaxed text-white/75">
            {currentProduct.description}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-lg font-semibold text-white">
              {typeof currentProduct.price === "number"
                ? `$${currentProduct.price.toFixed(2)}`
                : currentProduct.price}
            </p>
            <button
              type="button"
              onClick={() => addToCart(currentProduct)}
              className="inline-flex items-center justify-center rounded-md bg-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

