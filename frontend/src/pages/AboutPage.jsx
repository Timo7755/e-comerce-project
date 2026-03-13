import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
            About this project
          </span>
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-white/70">
          <span className="font-semibold text-white">
            E-comerce Thrift is a web development project
          </span>
          . It’s built to showcase an e-commerce flow (browse listings, cart,
          admin uploads, checkout UI) — it is{" "}
          <span className="font-semibold">not</span> a real store.
        </p>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/75">
            <span className="font-semibold text-white">
              Payments are not possible.
            </span>{" "}
            Any “checkout” behavior is for demonstration/testing only and should
            not be used as a real purchase system.
          </p>
        </div>

        <p className="mt-5 text-sm text-white/65">
          If you’re reviewing this project, feel free to explore the UI — and if
          you want to see how it’s built, check the repo setup and code
          structure.
        </p>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
