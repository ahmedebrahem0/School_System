// components/layout/Header.tsx

// Top header bar for the dashboard layout
// Contains breadcrumbs, search, and user dropdown menu

"use client";

import { useState, useRef, useEffect } from "react";
import { Search, LogOut, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { getInitials } from "@/lib/utils/formatters";
import { ROLE_META } from "@/constants/roles";
import { cn } from "@/lib/utils/cn";
import Breadcrumbs from "./Breadcrumbs";

// ─────────────────────────────────────────────────────
// HEADER PROPS
// onMenuClick — triggers mobile sidebar open
// ─────────────────────────────────────────────────────
interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useAuth();
  const { logout } = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = getInitials(user.fullName);
  const roleMeta = ROLE_META[user.role];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[260px] h-16 bg-white border-b border-zinc-200 z-30">
      <div className="flex items-center justify-between h-full px-6">

        {/* ─────────────────────────────────────────
            LEFT — Mobile Menu + Breadcrumbs
            ───────────────────────────────────────── */}
        <div className="flex items-center gap-4">

          {/* Mobile hamburger menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs — hidden on mobile */}
          <div className="hidden sm:block">
            <Breadcrumbs />
          </div>

        </div>

        {/* ─────────────────────────────────────────
            CENTER — Search Bar
            Hidden on mobile
            ───────────────────────────────────────── */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search students, teachers..."
              className={cn(
                "w-[320px] h-9 pl-10 pr-4",
                "bg-zinc-100 border border-zinc-200 rounded-full",
                "text-[13px] text-zinc-700 placeholder:text-zinc-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                "focus:border-blue-400 focus:bg-white",
                "transition-all duration-200"
              )}
            />
          </div>
        </div>

        {/* ─────────────────────────────────────────
            RIGHT — User Dropdown
            ───────────────────────────────────────── */}
        <div className="relative" ref={dropdownRef}>

          {/* Avatar Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center gap-2.5 px-2 py-1.5 rounded-lg",
              "hover:bg-zinc-100 transition-colors duration-150"
            )}
          >
            {/* Avatar Circle */}
            <div className="w-9 h-9 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-[13px] font-semibold shrink-0">
              {initials}
            </div>

            {/* Name + Role — hidden on mobile */}
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-medium text-zinc-800 leading-none">
                {user.fullName}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {roleMeta.label}
              </p>
            </div>

            <ChevronDown className={cn(
              "hidden sm:block w-4 h-4 text-zinc-400 transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          {/* ───────────────────────────────────────
              DROPDOWN MENU
              ─────────────────────────────────────── */}
          {isDropdownOpen && (
            <div className={cn(
              "absolute right-0 top-full mt-2",
              "w-[220px] bg-white rounded-xl shadow-lg",
              "border border-zinc-200 overflow-hidden",
              "animate-in fade-in-0 zoom-in-95 duration-150"
            )}>

              {/* User Info */}
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="text-[13px] font-medium text-zinc-800 truncate">
                  {user.fullName}
                </p>
                <p className="text-[12px] text-zinc-500 truncate mt-0.5">
                  {user.email}
                </p>
                {/* Role Badge */}
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full mt-1.5",
                  "text-[11px] font-medium",
                  roleMeta.color
                )}>
                  {roleMeta.label}
                </span>
              </div>

              {/* Logout Button */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg",
                    "text-[13px] text-red-600 hover:bg-red-50",
                    "transition-colors duration-150"
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default Header;