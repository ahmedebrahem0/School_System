import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon to show on the left inside the input */
  leftIcon?: React.ReactNode
  /** Icon or element to show on the right inside the input */
  rightIcon?: React.ReactNode
  /** Error state — shows red border + ring */
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="absolute left-3 flex items-center text-zinc-400 pointer-events-none [&_svg]:size-4"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              // Base
              "flex h-11 w-full rounded-[8px] border bg-white px-3 py-2 text-[14px] text-zinc-900",
              "placeholder:text-zinc-400",
              // Border
              error
                ? "border-red-400 ring-1 ring-red-100"
                : "border-zinc-300",
              // Focus
              "focus-visible:outline-none focus-visible:ring-2",
              error
                ? "focus-visible:ring-red-200 focus-visible:border-red-400"
                : "focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6]",
              // Transition
              "transition-all duration-150",
              // Disabled
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50",
              // Padding adjustments for icons
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            {...props}
          />
          {rightIcon && (
            <span
              className="absolute right-3 flex items-center text-zinc-400 [&_svg]:size-4"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          // Base
          "flex h-11 w-full rounded-[8px] border bg-white px-3 py-2 text-[14px] text-zinc-900",
          "placeholder:text-zinc-400",
          // Border
          error
            ? "border-red-400 ring-1 ring-red-100"
            : "border-zinc-300",
          // Focus
          "focus-visible:outline-none focus-visible:ring-2",
          error
            ? "focus-visible:ring-red-200 focus-visible:border-red-400"
            : "focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6]",
          // Transition
          "transition-all duration-150",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50",
          className
        )}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }