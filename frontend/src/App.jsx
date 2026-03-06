import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import SuccessPage from "./pages/SuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import OrdersPage from "./pages/OrdersPage";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";

/**
 * App shell & routes.
 *
 * Public: browse categories/products, cart, about, Stripe success/cancel pages.
 * Member-only: `/orders` (purchase history).
 * Admin-only: `/secret-dashboard` (manage listings).
 *
 * `checkAuth()` loads the current user (if cookies exist) so the UI can render
 * the right nav links and protected pages.
 */
export default function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (checkingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-[#07040f] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute top-20 -left-24 h-[520px] w-[520px] rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[620px] w-[620px] rounded-full bg-pink-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.25)_0%,rgba(236,72,153,0.14)_42%,rgba(0,0,0,0)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* App */}
      <div className="relative z-10 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
          <Route
            path="/orders"
            element={user ? <OrdersPage /> : <Navigate to="/login" />}
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}
