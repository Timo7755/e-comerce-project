import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

/**
 * Cart store (guest-first).
 *
 * This project supports shopping without an account, so the cart is stored in
 * `localStorage` and is always available. If a user logs in later, we can add
 * syncing logic, but the core UX works for guests.
 *
 * Coupons are global (admin-created) and validated via a public endpoint.
 */
const CART_STORAGE_KEY = "vv_thrift_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

export const useCartStore = create((set, get) => ({
	cart: loadCart(),
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		// Guest-first: cart lives locally. (If you later want server carts for logged-in users,
		// you can sync here.)
		const cart = loadCart();
		set({ cart });
		get().calculateTotals();
	},
	clearCart: async () => {
		saveCart([]);
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
		try {
			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				saveCart(newCart);
				return { cart: newCart };
			});
			get().calculateTotals();
			toast.success("Added to cart");
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},
	removeFromCart: async (productId) => {
		set((prevState) => {
			const newCart = prevState.cart.filter((item) => item._id !== productId);
			saveCart(newCart);
			return { cart: newCart };
		});
		get().calculateTotals();
	},
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		set((prevState) => {
			const newCart = prevState.cart.map((item) =>
				item._id === productId ? { ...item, quantity } : item
			);
			saveCart(newCart);
			return { cart: newCart };
		});
		get().calculateTotals();
	},
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));
