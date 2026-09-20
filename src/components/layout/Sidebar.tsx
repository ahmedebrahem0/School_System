// components/layout/Sidebar.tsx

// Main sidebar navigation component
// Renders role-based navigation items
// Fixed positioned on the left side of the dashboard

"use client";

import { GraduationCap, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { NAV_CONFIG } from "@/constants/nav-config";
import { getInitials } from "@/lib/utils/formatters";
import { ROLE_META } from "@/constants/roles";
import { cn } from "@/lib/utils/cn";
import SidebarItem from "./SidebarItem";

// ─────────────────────────────────────────────────────
// SIDEBAR COMPONENT
// ─────────────────────────────────────────────────────
// Keeps dashboard navigation role-aware while preserving the fixed desktop layout.
const Sidebar = () => {
  const { user } = useAuth();
  const { logout } = useLogout();
  const { isCollapsed, toggle } = useSidebar();

  // Avoid rendering navigation until the authenticated user is available.
  if (!user) return null;

  // Falls back to an empty navigation list when a role has no configured links yet.
  const navSections = NAV_CONFIG[user.role] ?? [];
  // Role metadata controls the readable label shown in the profile badge.
  const roleMeta = ROLE_META[user.role];
  // Initials keep the avatar useful even when there is no profile image.
  const initials = getInitials(user.fullName);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#1E3A8A] flex flex-col z-40",
        "transition-[width] duration-200 ease-in-out",
        isCollapsed ? "w-[76px]" : "w-[260px]"
      )}
    >

      {/* ─────────────────────────────────────────────
          LOGO AREA
          ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-white/10 shrink-0 overflow-hidden">
        {/* Brand mark anchors the sidebar and keeps the product identity visible. */}
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="whitespace-nowrap">
            <p className="text-white font-bold text-[15px] leading-none">
              EduSystem
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">
              Management Portal
            </p>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          USER PROFILE SECTION
          ───────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-white/10 shrink-0 overflow-hidden">
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "bg-white/20 text-white text-[14px] font-semibold shrink-0",
            "ring-2 ring-white/20"
          )}>
            {initials}
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-[14px] font-medium truncate">
                {user.fullName}
              </p>
              {/* Role Badge */}
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full",
                "text-[11px] font-medium mt-0.5",
                "bg-white/15 text-white/80"
              )}>
                {roleMeta.label}
              </span>
            </div>
          )}

        </div>
      </div>

      {/* ─────────────────────────────────────────────
          NAVIGATION
          Scrollable if content is too long
          ───────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0">
        <nav className="h-full overflow-y-auto py-3 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navSections.map((section) => (
            <div key={section.label}>

              {/* Section Label */}
              {!isCollapsed && (
                <p className="px-6 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40 whitespace-nowrap">
                  {section.label}
                </p>
              )}

              {/* Section Items */}
              {section.items.map((item) => (
                <SidebarItem key={item.href} {...item} collapsed={isCollapsed} />
              ))}

            </div>
          ))}
        </nav>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-[#1E3A8A] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#1E3A8A] to-transparent" />
      </div>

      {/* ─────────────────────────────────────────────
          COLLAPSE TOGGLE
          ───────────────────────────────────────────── */}
      <div className="px-4 pt-2 shrink-0">
        <button
          onClick={toggle}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
            "text-white/50 hover:text-white hover:bg-white/10",
            "text-[13px] transition-all duration-150",
            isCollapsed && "justify-center"
          )}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-[16px] h-[16px] shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="w-[16px] h-[16px] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────
          LOGOUT BUTTON
          ───────────────────────────────────────────── */}
      <div className="px-4 py-4 border-t border-white/10 shrink-0">
        <button
          onClick={logout}
          title="Logout"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-white/60 hover:text-white hover:bg-white/10",
            "text-[14px] transition-all duration-150",
            isCollapsed && "justify-center"
          )}
        >
          <svg
            className="w-[18px] h-[18px] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
