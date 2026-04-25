import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const badgeVariants = cva(
  // Base: rounded-full pill, 12px/500, px-2.5 py-0.5
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-[500] leading-none whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        // ── Semantic Status ──────────────────────────────
        // Present / Success
        success:
          "bg-emerald-100 text-emerald-700",
        // Absent / Danger
        danger:
          "bg-red-100 text-red-700",
        // Late / Warning
        warning:
          "bg-amber-100 text-amber-700",
        // Info / Admin
        info:
          "bg-indigo-100 text-indigo-700",

        // ── Role Badges ──────────────────────────────────
        admin:
          "bg-indigo-100 text-indigo-700",
        teacher:
          "bg-teal-100 text-teal-700",
        student:
          "bg-blue-100 text-blue-700",

        // ── Grade / Pass-Fail ────────────────────────────
        pass:
          "bg-emerald-100 text-emerald-700",
        fail:
          "bg-red-100 text-red-700",

        // ── Attendance ───────────────────────────────────
        present:
          "bg-emerald-100 text-emerald-700",
        absent:
          "bg-red-100 text-red-700",
        late:
          "bg-amber-100 text-amber-700",

        // ── Generic ──────────────────────────────────────
        default:
          "bg-zinc-100 text-zinc-700",
        primary:
          "bg-[#DBEAFE] text-[#1E3A8A]",
        accent:
          "bg-[#CCFBF1] text-[#0F766E]",
        outline:
          "border border-zinc-300 text-zinc-600 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional dot indicator before the label */
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            // Dot color matches variant
            variant === "success" || variant === "present" || variant === "pass"
              ? "bg-emerald-500"
              : variant === "danger" || variant === "absent" || variant === "fail"
              ? "bg-red-500"
              : variant === "warning" || variant === "late"
              ? "bg-amber-500"
              : variant === "info" || variant === "admin"
              ? "bg-indigo-500"
              : variant === "teacher"
              ? "bg-teal-500"
              : variant === "student" || variant === "primary"
              ? "bg-blue-500"
              : "bg-zinc-400"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }