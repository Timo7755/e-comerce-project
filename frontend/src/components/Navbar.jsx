import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useMemo } from "react";

/**
 * Top navigation.
 *
 * Shows links based on auth state:
 * - Guests: login/signup + cart
 * - Members: orders + logout
 * - Admins: dashboard link
 *
 * Cart badge is powered by the guest-first cart store (localStorage).
 */
const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart, getCartItems } = useCartStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  const cartCount = useMemo(() => {
    return (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cart]);

  return (
    <header className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-black/40 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
              E-commerce Thrift
            </span>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Home
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <ShoppingCart size={18} className="text-white/70" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[11px] font-semibold text-white ring-2 ring-black/40">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {user && (
            <Link
              to="/orders"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:border-fuchsia-400/30 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/25"
            >
              <Lock size={16} className="text-white/80" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

          {user ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85 transition-colors hover:border-fuchsia-400/30 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              onClick={logout}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-3 py-1.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.18)] transition-colors hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <UserPlus size={16} />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <LogIn size={16} />
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
