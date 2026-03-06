import { Link } from "react-router-dom";

/**
 * Simple site footer.
 *
 * Contains a required disclaimer link (`/about`) for this demo project.
 */
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-white/55 sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <div>© 2025 Violet Vault Thrift</div>
        <Link
          to="/about"
          className="text-white/60 underline-offset-4 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          About this project
        </Link>
      </div>
    </footer>
  );
}

