// components/layout/SidebarItem.tsx

// Single navigation item for Sidebar and MobileNav
// Handles active state detection and displays icon + label

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────
export interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number; // Optional notification count
  collapsed?: boolean;
}

// ─────────────────────────────────────────────────────
// SIDEBAR ITEM COMPONENT
// ─────────────────────────────────────────────────────
const SidebarItem = ({ label, href, icon: Icon, badge, collapsed }: SidebarItemProps) => {
  const pathname = usePathname();

  // Check if current route matches this item
  // Using startsWith to handle nested routes
  // Example: /students/create → /students is active
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        // Base styles
        "flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 my-0.5",
        "text-[14px] transition-all duration-150",
        collapsed && "justify-center",

        // Default state
        "text-white/65 hover:text-white/90 hover:bg-white/10",

        // Active state
        isActive && [
          "bg-white/15 text-white font-medium",
          !collapsed && "border-l-[3px] border-white/60 rounded-l-none",
        ]
      )}
    >
      {/* Icon */}
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0 transition-opacity duration-150",
          isActive ? "opacity-100" : "opacity-65"
        )}
      />

      {!collapsed && (
        <>
          {/* Label */}
          <span className="flex-1 truncate">{label}</span>

          {/* Badge — optional notification count */}
          {badge !== undefined && badge > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-medium">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
};

export default SidebarItem;