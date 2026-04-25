import * as React from "react"
import { cn } from "@/lib/utils/cn"

// ─── Table Wrapper ────────────────────────────────────────────────────────────
// horizontal scroll on mobile, sticky first column
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm border-collapse", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

// ─── Table Header ────────────────────────────────────────────────────────────
// bg-zinc-50, border-b zinc-200
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-zinc-50 border-b border-zinc-200", className)}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

// ─── Table Body ──────────────────────────────────────────────────────────────
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

// ─── Table Footer ────────────────────────────────────────────────────────────
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-zinc-200 bg-zinc-50 font-medium",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

// ─── Table Row ───────────────────────────────────────────────────────────────
// hover:bg-zinc-50 transition-colors duration-100, border-b zinc-100
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-zinc-100",
      "hover:bg-zinc-50 transition-colors duration-100",
      "data-[state=selected]:bg-[#DBEAFE]",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

// ─── Table Head ──────────────────────────────────────────────────────────────
// 12px / 600 / uppercase / tracking-wide / zinc-500 — px-4 py-3
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-3 text-left",
      "text-[12px] font-[600] uppercase tracking-wide text-zinc-500",
      "whitespace-nowrap",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// ─── Table Cell ──────────────────────────────────────────────────────────────
// px-4 py-3, text-[14px] text-zinc-700
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3",
      "text-[14px] text-zinc-700",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

// ─── Table Caption ───────────────────────────────────────────────────────────
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-[13px] text-zinc-500", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}