// components/common/Loader.tsx

// Full-page loading indicator
// Used only for initial page load or auth checking
// For content loading use Skeleton components instead

import { cn } from "@/lib/utils/cn";

// ─────────────────────────────────────────────────────
// LOADER PROPS
// ─────────────────────────────────────────────────────
interface LoaderProps {
  // Full page center — used for auth loading
  fullPage?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────
// LOADER COMPONENT
// ─────────────────────────────────────────────────────
const Loader = ({ fullPage = false, className }: LoaderProps) => {
  const spinner = (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Spinner */}
      <div className="relative w-10 h-10">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-zinc-200" />
        {/* Spinning arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1E3A8A] animate-spin" />
      </div>

      {/* Label */}
      <p className="text-[13px] text-zinc-500 font-medium">
        Loading...
      </p>
    </div>
  );

  // Full page variant — centered in viewport
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F8FAFC] z-50">
        {spinner}
      </div>
    );
  }

  // Inline variant
  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
};

export default Loader;