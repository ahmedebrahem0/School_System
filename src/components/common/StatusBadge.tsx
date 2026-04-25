// components/common/StatusBadge.tsx

// Reusable colored badge component
// Used across tables for attendance, grades, and role display

import { cn } from "@/lib/utils/cn";

// ─────────────────────────────────────────────────────
// BADGE VARIANTS
// Each variant has its own color scheme
// ─────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  // Attendance
  present: "bg-emerald-100 text-emerald-700",
  absent:  "bg-red-100 text-red-700",
  late:    "bg-amber-100 text-amber-700",

  // Grades
  pass: "bg-emerald-100 text-emerald-700",
  fail: "bg-red-100 text-red-700",

  // Roles
  admin:   "bg-indigo-100 text-indigo-700",
  teacher: "bg-teal-100 text-teal-700",
  student: "bg-blue-100 text-blue-700",

  // General
  active:   "bg-emerald-100 text-emerald-700",
  inactive: "bg-zinc-100 text-zinc-600",
  pending:  "bg-amber-100 text-amber-700",
} as const;

export type BadgeVariant = keyof typeof BADGE_VARIANTS;

// ─────────────────────────────────────────────────────
// STATUS BADGE PROPS
// ─────────────────────────────────────────────────────
interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string; // Optional custom label — defaults to variant name
  className?: string;
}

// ─────────────────────────────────────────────────────
// STATUS BADGE COMPONENT
// ─────────────────────────────────────────────────────
const StatusBadge = ({ variant, label, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full",
        "text-[12px] font-medium capitalize",
        BADGE_VARIANTS[variant],
        className
      )}
    >
      {label ?? variant}
    </span>
  );
};

export default StatusBadge;