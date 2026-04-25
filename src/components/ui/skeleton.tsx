import * as React from "react"
import { cn } from "@/lib/utils/cn"

// ─── Base Skeleton ────────────────────────────────────────────────────────────
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[6px] bg-zinc-100",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

// ─── Table Row Skeleton ───────────────────────────────────────────────────────
// Matches actual table row shape
function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-zinc-100" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton
            className={cn(
              "h-4",
              i === 0 ? "w-8" : i === 1 ? "w-36" : i === cols - 1 ? "w-20" : "w-24"
            )}
          />
        </td>
      ))}
    </tr>
  )
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────
function TableSkeleton({
  rows = 8,
  cols = 5,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <tbody aria-label="Loading..." role="status">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </tbody>
  )
}

// ─── Card Skeleton ────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div
      className="bg-white rounded-[10px] border border-zinc-200 p-5 shadow-sm"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-11 w-11 rounded-[10px]" />
      </div>
    </div>
  )
}

// ─── Stat Cards Grid Skeleton ─────────────────────────────────────────────────
function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count}`}
      role="status"
      aria-label="Loading stats..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── List Skeleton ────────────────────────────────────────────────────────────
function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading...">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

// ─── Page Header Skeleton ─────────────────────────────────────────────────────
function PageHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between mb-6" aria-hidden="true">
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-7 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-[8px]" />
        <Skeleton className="h-9 w-32 rounded-[8px]" />
      </div>
    </div>
  )
}

// ─── Form Skeleton ────────────────────────────────────────────────────────────
function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-5" role="status" aria-label="Loading form...">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-11 w-full rounded-[8px]" />
        </div>
      ))}
      <Skeleton className="h-11 w-full rounded-[8px] mt-2" />
    </div>
  )
}

export {
  Skeleton,
  TableRowSkeleton,
  TableSkeleton,
  CardSkeleton,
  StatCardsSkeleton,
  ListSkeleton,
  PageHeaderSkeleton,
  FormSkeleton,
}