import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

/**
 * Product store.
 *
 * - Public fetching for browsing (`/products/public`, category, product detail)
 * - Admin actions for managing listings (create/update/delete/feature)
 */
export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  currentProduct: null,

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prev) => ({
        products: [res.data, ...prev.products],
        loading: false,
      }));
      toast.success("Product created");
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create product");
      throw error;
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/public");
      set({ products: res.data.products || [], loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch products");
      throw error;
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      const data = res.data;
      const products = Array.isArray(data) ? data : data.products || [];
      set({ products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch products");
      throw error;
    }
  },

  fetchProductById: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/public/${productId}`);
      set({ currentProduct: res.data, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch product");
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prev) => ({
        products: prev.products.filter((p) => p._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to delete product");
      throw error;
    }
  },

  updateProduct: async (productId, updates) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${productId}`, updates);
      const updated = res.data;
      set((prev) => ({
        products: prev.products.map((p) => (p._id === productId ? updated : p)),
        loading: false,
      }));
      toast.success("Listing updated");
      return updated;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to update product");
      throw error;
    }
  },
}));
