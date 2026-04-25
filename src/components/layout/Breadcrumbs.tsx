// components/layout/Breadcrumbs.tsx

// Reads current pathname and converts it to readable breadcrumb trail
// Used inside the Header component

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─────────────────────────────────────────────────────
// SEGMENT LABEL MAP
// Converts URL segments to readable labels
// ─────────────────────────────────────────────────────
const SEGMENT_LABELS: Record<string, string> = {
  dashboard:     "Dashboard",
  students:      "Students",
  teachers:      "Teachers",
  classes:       "Classes",
  subjects:      "Subjects",
  grades:        "Grades",
  attendances:   "Attendances",
  reports:       "Reports",
  admin:         "Admin",
  users:         "Users",
  roles:         "Roles",
  teacher:       "Teacher",
  student:       "Student",
  "my-classes":  "My Classes",
  "my-profile":  "My Profile",
  "my-grades":   "My Grades",
  "my-attendance": "My Attendance",
  create:        "Create",
};

// ─────────────────────────────────────────────────────
// BREADCRUMB ITEM TYPE
// ─────────────────────────────────────────────────────
interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

// ─────────────────────────────────────────────────────
// BUILD BREADCRUMBS FROM PATHNAME
// /students/create → [Home, Students, Create]
// ─────────────────────────────────────────────────────
const buildBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = segments.map((segment, index) => {
    // Build href up to this segment
    const href = "/" + segments.slice(0, index + 1).join("/");

    // If segment is a number → it's an ID
    const label = isNaN(Number(segment))
      ? (SEGMENT_LABELS[segment] ?? segment)
      : "Details";

    return {
      label,
      href,
      isLast: index === segments.length - 1,
    };
  });

  return items;
};

// ─────────────────────────────────────────────────────
// BREADCRUMBS COMPONENT
// ─────────────────────────────────────────────────────
const Breadcrumbs = () => {
  const pathname = usePathname();
  const items = buildBreadcrumbs(pathname);

  return (
    <nav className="flex items-center gap-1">

      {/* Home */}
      <Link
        href="/dashboard"
        className="text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* Segments */}
      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-1">

          {/* Separator */}
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />

          {/* Link or Text */}
          {item.isLast ? (
            <span className="text-[13px] font-medium text-zinc-700">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "text-[13px] text-zinc-400",
                "hover:text-zinc-600 transition-colors"
              )}
            >
              {item.label}
            </Link>
          )}

        </div>
      ))}

    </nav>
  );
};

export default Breadcrumbs;