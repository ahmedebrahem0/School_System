// components/common/EmptyState.tsx

// Displayed when a list or table has no data to show
// Supports custom icon, title, description, and action button

import { cn } from "@/lib/utils/cn";
import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────
// EMPTY STATE PROPS
// ─────────────────────────────────────────────────────
interface EmptyStateProps {
  // Custom icon — defaults to Inbox
  icon?: LucideIcon;

  title: string;
  description?: string;

  // Optional action button
  actionLabel?: string;
  onAction?: () => void;

  className?: string;
}

// ─────────────────────────────────────────────────────
// EMPTY STATE COMPONENT
// ─────────────────────────────────────────────────────
const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon Container */}
      <div className={cn(
        "w-16 h-16 rounded-2xl",
        "bg-zinc-100 flex items-center justify-center",
        "mb-4"
      )}>
        <Icon className="w-8 h-8 text-zinc-400" />
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-600 text-zinc-700 mb-1">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[14px] text-zinc-500 max-w-sm">
          {description}
        </p>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="mt-6 border-zinc-300 text-zinc-700 hover:bg-zinc-50"
        >
          {actionLabel}
        </Button>
      )}

    </div>
  );
};

export default EmptyState;