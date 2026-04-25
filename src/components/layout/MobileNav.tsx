// components/layout/MobileNav.tsx

// Mobile navigation drawer
// Slides in from the left when hamburger menu is clicked
// Contains same navigation as Sidebar

"use client";

import { useEffect } from "react";
import { X, GraduationCap } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { ROLE_META } from "@/constants/roles";
import { getInitials } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";
import SidebarItem from "./SidebarItem";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  UserCog,
  School,
  CalendarCheck,
  UserCircle,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

// ─────────────────────────────────────────────────────
// NAV CONFIG — same as Sidebar
// ─────────────────────────────────────────────────────
const NAV_CONFIG = {
  [ROLES.ADMIN]: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard",   href: ROUTES.DASHBOARD,        icon: LayoutDashboard },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Students",   href: ROUTES.STUDENTS.LIST,    icon: GraduationCap },
        { label: "Teachers",   href: ROUTES.TEACHERS.LIST,    icon: Users },
        { label: "Classes",    href: ROUTES.CLASSES.LIST,     icon: School },
        { label: "Subjects",   href: ROUTES.SUBJECTS.LIST,    icon: BookOpen },
      ],
    },
    {
      label: "Academic",
      items: [
        { label: "Grades",      href: ROUTES.GRADES.LIST,      icon: TrendingUp },
        { label: "Attendances", href: ROUTES.ATTENDANCES.LIST, icon: CalendarCheck },
        { label: "Reports",     href: ROUTES.REPORTS,          icon: BarChart3 },
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
        { label: "My Classes",  href: ROUTES.TEACHER.MY_CLASSES,  icon: School },
        { label: "Grades",      href: ROUTES.TEACHER.GRADES,      icon: TrendingUp },
        { label: "Attendances", href: ROUTES.TEACHER.ATTENDANCES, icon: CalendarCheck },
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
        { label: "My Attendance", href: ROUTES.STUDENT.MY_ATTENDANCE, icon: CalendarCheck },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────
// MOBILE NAV PROPS
// ─────────────────────────────────────────────────────
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────
// MOBILE NAV COMPONENT
// ─────────────────────────────────────────────────────
const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { user } = useAuth();
  const { logout } = useLogout();

  // Close drawer when route changes
  // Prevents drawer staying open after navigation
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!user) return null;

  const navSections = NAV_CONFIG[user.role] ?? [];
  const roleMeta = ROLE_META[user.role];
  const initials = getInitials(user.fullName);

  return (
    <>
      {/* ─────────────────────────────────────────────
          BACKDROP OVERLAY
          Click to close the drawer
          ───────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 lg:hidden",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* ─────────────────────────────────────────────
          DRAWER
          Slides in from left
          ───────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-[260px]",
          "bg-[#1E3A8A] flex flex-col z-50 lg:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >

        {/* Logo + Close Button */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              "bg-white/20 text-white text-[14px] font-semibold shrink-0",
              "ring-2 ring-white/20"
            )}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[14px] font-medium truncate">
                {user.fullName}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/15 text-white/80 mt-0.5">
                {roleMeta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-6 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                {section.label}
              </p>
              {section.items.map((item) => (
                <div key={item.href} onClick={onClose}>
                  <SidebarItem {...item} />
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/10 shrink-0">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
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
    </>
  );
};

export default MobileNav;