import CategoryItem from "../components/CategoryItem";
import { Link } from "react-router-dom";

const categories = [
  { slug: "jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { slug: "t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { slug: "shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { slug: "jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
              Thrift the drop
            </span>
          </h1>
          <p className="mt-4 text-base text-white/70 sm:text-xl">
            Curated secondhand finds, one-of-ones, and late-night fits — pick a
            category to start.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Member perks
          </h2>
          <p className="mt-2 text-sm text-white/65">
            You can shop as a guest anytime. Becoming a member unlocks the good
            stuff.
          </p>

          <ul className="mt-5 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Coupons & drop rewards
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Purchase history in one place
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Faster checkout next time
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Early access to fresh uploads
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-md bg-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              Become a member
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
