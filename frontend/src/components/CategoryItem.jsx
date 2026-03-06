import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <Link
      to={`/category/${encodeURIComponent(category.slug)}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-fuchsia-400/25 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
    >
      <div className="relative aspect-[16/10] w-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18)_0%,rgba(236,72,153,0.10)_42%,rgba(0,0,0,0.0)_70%)] opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.0)_100%)]" />

        <img
          src={category.imageUrl}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-300 group-hover:opacity-85"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="px-5 py-4">
        <p className="text-sm font-medium text-white/60">Shop</p>
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
