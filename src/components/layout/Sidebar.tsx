// components/layout/Sidebar.tsx

// Main sidebar navigation component
// Renders role-based navigation items
// Fixed positioned on the left side of the dashboard

"use client";

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  Shield,
  UserCog,
  School,
  CalendarCheck,
  UserCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { getInitials } from "@/lib/utils/formatters";
import { ROLE_META } from "@/constants/roles";
import { cn } from "@/lib/utils/cn";
import SidebarItem, { type SidebarItemProps } from "./SidebarItem";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────
// NAVIGATION CONFIG TYPES
// ─────────────────────────────────────────────────────
interface NavSection {
  label: string;
  items: SidebarItemProps[];
}

// ─────────────────────────────────────────────────────
// NAVIGATION CONFIG PER ROLE
// Single source of truth for all navigation items
// ─────────────────────────────────────────────────────
const NAV_CONFIG: Record<string, NavSection[]> = {
  [ROLES.ADMIN]: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Students",  href: ROUTES.STUDENTS.LIST,  icon: GraduationCap },
        { label: "Teachers",  href: ROUTES.TEACHERS.LIST,  icon: Users },
        { label: "Classes",   href: ROUTES.CLASSES.LIST,   icon: School },
        { label: "Subjects",  href: ROUTES.SUBJECTS.LIST,  icon: BookOpen },
      ],
    },
    {
      label: "Academic",
      items: [
        { label: "Grades",      href: ROUTES.GRADES.LIST,      icon: TrendingUp },
        { label: "Attendances", href: ROUTES.ATTENDANCES.LIST,  icon: CalendarCheck },
        { label: "Reports",     href: ROUTES.REPORTS,           icon: BarChart3 },
      ],
    },
    {
      label: "System",
      items: [
        { label: "Users", href: ROUTES.ADMIN.USERS, icon: UserCog },
        { label: "Roles", href: ROUTES.ADMIN.ROLES, icon: Shield },
      ],
    },
  ],

  [ROLES.TEACHER]: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      ],
    },
    {
      label: "My Work",
      items: [
        { label: "My Classes",   href: ROUTES.TEACHER.MY_CLASSES,   icon: School },
        { label: "Grades",       href: ROUTES.TEACHER.GRADES,        icon: TrendingUp },
        { label: "Attendances",  href: ROUTES.TEACHER.ATTENDANCES,   icon: CalendarCheck },
      ],
    },
  ],

  [ROLES.STUDENT]: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      ],
    },
    {
      label: "My Academics",
      items: [
        { label: "My Profile",    href: ROUTES.STUDENT.MY_PROFILE,    icon: UserCircle },
        { label: "My Grades",     href: ROUTES.STUDENT.MY_GRADES,     icon: ClipboardList },
        { label: "My Attendance", href: ROUTES.STUDENT.MY_ATTENDANCE,  icon: CalendarCheck },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────
// SIDEBAR COMPONENT
// ─────────────────────────────────────────────────────
const Sidebar = () => {
  const { user } = useAuth();
  const { logout } = useLogout();

  if (!user) return null;

  const navSections = NAV_CONFIG[user.role] ?? [];
  const roleMeta = ROLE_META[user.role];
  const initials = getInitials(user.fullName);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#1E3A8A] flex flex-col z-40">

      {/* ─────────────────────────────────────────────
          LOGO AREA
          ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-none">
            EduSystem
          </p>
          <p className="text-white/40 text-[10px] mt-0.5">
            Management Portal
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          USER PROFILE SECTION
          ───────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-white/10 shrink-0">
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

        </div>
      </div>

      {/* ─────────────────────────────────────────────
          NAVIGATION
          Scrollable if content is too long
          ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
        {navSections.map((section) => (
          <div key={section.label}>

            {/* Section Label */}
            <p className="px-6 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {section.label}
            </p>

            {/* Section Items */}
            {section.items.map((item) => (
              <SidebarItem key={item.href} {...item} />
            ))}

          </div>
        ))}
      </nav>

      {/* ─────────────────────────────────────────────
          LOGOUT BUTTON
          ───────────────────────────────────────────── */}
      <div className="px-4 py-4 border-t border-white/10 shrink-0">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-white/60 hover:text-white hover:bg-white/10",
            "text-[14px] transition-all duration-150",
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
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;