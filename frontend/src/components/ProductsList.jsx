import { Pencil, Trash } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";
import { createPortal } from "react-dom";

/**
 * Admin products table.
 *
 * - Shows all listings
 * - Allows delete, feature toggle, and editing a listing (including gallery images)
 *
 * The edit UI is rendered in a portal to avoid being clipped by table overflow.
 */
const ProductsList = () => {
  const { deleteProduct, updateProduct, products } = useProductStore();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (p) => {
    setEditing({
      _id: p._id,
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      category: p.category || "",
      images:
        (Array.isArray(p.images) ? p.images : []).length > 0
          ? p.images
          : p.image
            ? [p.image]
            : [],
    });
  };

  const onPickImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      const base64s = await Promise.all(files.map(toBase64));
      setEditing((prev) =>
        prev
          ? { ...prev, images: [...prev.images, ...base64s].slice(0, 8) }
          : prev,
      );
    } finally {
      e.target.value = "";
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateProduct(editing._id, {
        name: editing.name,
        description: editing.description,
        price: Number(editing.price),
        category: editing.category,
        images: editing.images,
      });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {products?.map((product) => (
              <tr
                key={product._id}
                className="transition-colors hover:bg-white/5"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                      <img
                        className="h-10 w-10 object-cover"
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/70">
                    ${product.price.toFixed(2)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/70">{product.category}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => startEdit(product)}
                    className="mr-2 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-fuchsia-400/25 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    aria-label="Edit product"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-rose-200/90 transition hover:border-rose-400/25 hover:bg-rose-400/10 hover:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    aria-label="Delete product"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        typeof document !== "undefined"
          ? createPortal(
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b0615] p-5 shadow-[0_18px_80px_rgba(0,0,0,0.65)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Edit listing
                      </h3>
                      <p className="mt-1 text-sm text-white/60">
                        Update details and gallery images.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-white/70">
                        Name
                      </label>
                      <input
                        value={editing.name}
                        onChange={(e) =>
                          setEditing((p) => ({ ...p, name: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-white/70">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={editing.description}
                        onChange={(e) =>
                          setEditing((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        className="mt-1 w-full resize-none rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editing.price}
                        onChange={(e) =>
                          setEditing((p) => ({ ...p, price: e.target.value }))
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70">
                        Category
                      </label>
                      <input
                        value={editing.category}
                        onChange={(e) =>
                          setEditing((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between gap-3">
                        <label className="block text-sm font-medium text-white/70">
                          Images
                        </label>
                        <label className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10">
                          Add images
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={onPickImages}
                          />
                        </label>
                      </div>

                      {editing.images?.length ? (
                        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {editing.images.map((src, idx) => (
                            <div
                              key={`${idx}-${String(src).slice(0, 20)}`}
                              className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5"
                            >
                              <img
                                src={src}
                                alt={`Edit ${idx + 1}`}
                                className="h-20 w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setEditing((p) => ({
                                    ...p,
                                    images: p.images.filter((_, i) => i !== idx),
                                  }))
                                }
                                className="absolute right-1 top-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold text-white/80 hover:bg-black/75"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-white/55">
                          No images yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={saveEdit}
                      className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </div>
              </div>,
              document.body,
            )
          : null
      ) : null}
    </>
  );
};
export default ProductsList;
