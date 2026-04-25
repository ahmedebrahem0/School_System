import * as React from "react"
import { cn } from "@/lib/utils/cn"

// ─── Card Root ────────────────────────────────────────────────────────────────
// bg-white rounded-[10px] border border-zinc-200 shadow-sm
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white rounded-[10px] border border-zinc-200",
      "shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]",
      "hover:shadow-[0_4px_6px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)] transition-shadow duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// ─── Card Header ─────────────────────────────────────────────────────────────
// border-b border-zinc-100 pb-4 mb-4 — flex items-center justify-between
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between",
      "border-b border-zinc-100 pb-4 mb-4 px-5 pt-5",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// ─── Card Title ──────────────────────────────────────────────────────────────
// 16px / 600 / zinc-950
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[16px] font-[600] text-zinc-950 leading-snug",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ─── Card Description ────────────────────────────────────────────────────────
// 13px / zinc-500
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[13px] text-zinc-500 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ─── Card Content ────────────────────────────────────────────────────────────
// p-5
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-5 pb-5", className)} {...props} />
))
CardContent.displayName = "CardContent"

// ─── Card Footer ─────────────────────────────────────────────────────────────
// px-5 pb-5 border-t border-zinc-100 pt-4
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center px-5 pb-5 pt-4 border-t border-zinc-100",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// ─── Stat Card ───────────────────────────────────────────────────────────────
// Special card for dashboard stats
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon: React.ReactNode
  iconBg?: string
  iconColor?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      trend,
      trendUp = true,
      icon,
      iconBg = "#DBEAFE",
      iconColor = "#1E3A8A",
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-[10px] border border-zinc-200 p-5",
        "shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_4px_6px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)] transition-shadow duration-200",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span
            className="text-[32px] font-[700] font-mono text-zinc-950 leading-none"
          >
            {value}
          </span>
          <span className="text-[13px] text-zinc-500 mt-1">{label}</span>
          {trend && (
            <span
              className={cn(
                "text-[12px] font-[500] mt-1",
                trendUp ? "text-emerald-600" : "text-red-500"
              )}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          )}
        </div>
        <div
          className="flex items-center justify-center w-[44px] h-[44px] rounded-[10px] flex-shrink-0 [&_svg]:size-5"
          style={{ backgroundColor: iconBg, color: iconColor }}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </div>
  )
)
StatCard.displayName = "StatCard"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
}