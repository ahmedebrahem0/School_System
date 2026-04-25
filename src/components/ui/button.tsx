import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3B82F6] disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary — bg #1E3A8A, hover #1D4ED8
        default:
          "bg-[#1E3A8A] text-white hover:bg-[#1D4ED8] shadow-sm",
        // Secondary — white bg, zinc border
        secondary:
          "bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 shadow-sm",
        // Danger — red
        danger:
          "bg-[#EF4444] text-white hover:bg-red-600 shadow-sm",
        // Ghost — transparent
        ghost:
          "bg-transparent text-zinc-600 hover:bg-zinc-100",
        // Outline — primary color outline
        outline:
          "border border-[#1E3A8A] text-[#1E3A8A] bg-transparent hover:bg-[#DBEAFE]",
        // Accent — teal
        accent:
          "bg-[#0F766E] text-white hover:bg-[#0d6460] shadow-sm",
        // Link
        link:
          "text-[#1D4ED8] underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        // sm — px-3 py-1.5 text-[13px]
        sm: "h-8 px-3 py-1.5 text-[13px] rounded-[8px] [&_svg]:size-3.5",
        // default — px-4 py-2 text-[14px]
        default: "h-9 px-4 py-2 text-[14px] rounded-[8px] [&_svg]:size-4",
        // lg — px-6 py-2.5 text-[15px]
        lg: "h-11 px-6 py-2.5 text-[15px] rounded-[8px] [&_svg]:size-4",
        // xl — full width login button style
        xl: "h-11 px-6 py-2.5 text-[15px] rounded-[8px] w-full [&_svg]:size-4",
        // icon only
        icon: "h-9 w-9 rounded-[8px] [&_svg]:size-4",
        "icon-sm": "h-8 w-8 rounded-[8px] [&_svg]:size-3.5",
        "icon-lg": "h-10 w-10 rounded-[8px] [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }