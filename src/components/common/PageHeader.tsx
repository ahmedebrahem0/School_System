// components/common/PageHeader.tsx

// Reusable page header component
// Used at the top of every dashboard page
// Supports title, subtitle, count badge, and action buttons

import { cn } from "@/lib/utils/cn";

// ─────────────────────────────────────────────────────
// PAGE HEADER PROPS
// ─────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  actions?: React.ReactNode;
  className?: string;
}

// ─────────────────────────────────────────────────────
// PAGE HEADER COMPONENT
// ─────────────────────────────────────────────────────
const PageHeader = ({
  title,
  subtitle,
  count,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between",
        "pb-6 mb-6 border-b border-zinc-200",
        className
      )}
    >
      {/* Left — Title + Subtitle + Count */}
      <div className="space-y-1">

        {/* Title + Count Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-950">
            {title}
          </h1>

          {/* Count Badge */}
          {count !== undefined && (
            <span className={cn(
              "inline-flex items-center justify-center",
              "px-2.5 py-0.5 rounded-full",
              "bg-[#DBEAFE] text-[#1E3A8A]",
              "text-[13px] font-semibold"
            )}>
              {count}
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[14px] text-zinc-500">
            {subtitle}
          </p>
        )}

      </div>

      {/* Right — Action Buttons */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}

    </div>
  );
};

export default PageHeader;