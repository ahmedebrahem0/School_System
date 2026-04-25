// components/common/ErrorMessage.tsx

// Displayed when an API call fails or an error occurs
// Supports custom title, description, and retry action

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

// ─────────────────────────────────────────────────────
// ERROR MESSAGE PROPS
// ─────────────────────────────────────────────────────
interface ErrorMessageProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────────────
// ERROR MESSAGE COMPONENT
// ─────────────────────────────────────────────────────
const ErrorMessage = ({
  title = "Something went wrong",
  description = "An error occurred while loading data. Please try again.",
  onRetry,
  className,
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-semibold text-zinc-800 mb-1">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[14px] text-zinc-500 max-w-sm">
        {description}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6 border-zinc-300 text-zinc-700 hover:bg-zinc-50 gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      )}

    </div>
  );
};

export default ErrorMessage;