const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07040f]">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-2 border-white/15" />
        <div className="absolute left-0 top-0 h-20 w-20 animate-spin rounded-full border-t-2 border-violet-400/80" />
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
