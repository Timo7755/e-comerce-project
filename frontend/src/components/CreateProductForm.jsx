import { useState } from "react";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

/**
 * Admin create listing form.
 *
 * Supports uploading multiple images which become the product gallery.
 * Images are read as base64 in the browser and uploaded to Cloudinary by backend.
 */
const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "jackets",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [],
      });
    } catch {
      console.log("error creating a product");
    }
  };

  const handleImagesChange = async (e) => {
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
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...base64s].slice(0, 6),
      }));
    } catch {
      console.log("error reading images");
    } finally {
      // allow re-selecting same file again
      e.target.value = "";
    }
  };

  return (
    <div className="mx-auto mb-8 w-full max-w-xl rounded-2xl border border-white/10 bg-black/35 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
          Create New Product
        </span>
      </h2>
      <p className="mt-1 text-sm text-white/60">Add a new listing.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white/70"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 shadow-sm outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-white/70"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full resize-none rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 shadow-sm outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-white/70"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 shadow-sm outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-white/70"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />
          <label
            htmlFor="image"
            className="inline-flex cursor-pointer items-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 shadow-sm transition hover:border-fuchsia-400/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Images
          </label>
          {newProduct.images?.length ? (
            <span className="ml-3 text-sm text-white/60">
              {newProduct.images.length} selected
            </span>
          ) : null}
        </div>

        {newProduct.images?.length ? (
          <div className="grid grid-cols-3 gap-2">
            {newProduct.images.map((src, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5"
              >
                <img
                  src={src}
                  alt={`Upload ${idx + 1}`}
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setNewProduct((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== idx),
                    }))
                  }
                  className="absolute right-1 top-1 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white/80 hover:bg-black/75"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};
export default CreateProductForm;
