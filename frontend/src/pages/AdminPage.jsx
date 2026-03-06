import { useEffect, useState } from "react";
import { PlusCircle, ShoppingBasket, Ticket } from "lucide-react";

import CreateProductForm from "../components/CreateProductForm";
import CreateCouponForm from "../components/CreateCouponForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "coupon", label: "Create Coupon", icon: Ticket },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="mt-3 text-sm text-white/60 sm:text-base">
            Manage listings and keep an eye on performance.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
                  activeTab === tab.id
                    ? "border border-fuchsia-400/20 bg-gradient-to-r from-violet-500/25 to-fuchsia-500/10 text-white shadow-[0_0_24px_rgba(236,72,153,0.10)]"
                    : "border border-white/10 bg-white/5 text-white/75 hover:border-fuchsia-400/20 hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon className="h-5 w-5 text-white/85" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "create" && <CreateProductForm />}
            {activeTab === "products" && <ProductsList />}
            {activeTab === "coupon" && <CreateCouponForm />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
