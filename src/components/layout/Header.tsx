// components/layout/Header.tsx

// Top header bar for the dashboard layout
// Contains breadcrumbs, search, and user dropdown menu

"use client";

import { useState } from "react";
import { LogOut, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { getInitials } from "@/lib/utils/formatters";
import { ROLE_META } from "@/constants/roles";
import { cn } from "@/lib/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Breadcrumbs from "./Breadcrumbs";
import GlobalSearch from "./GlobalSearch";

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
          <GlobalSearch />
        </div>

        {/* ─────────────────────────────────────────
            RIGHT — User Dropdown
            ───────────────────────────────────────── */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-lg",
                "hover:bg-zinc-100 transition-colors duration-150",
                "outline-none"
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
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[220px] p-0 overflow-hidden">
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

            {/* Logout */}
            <div className="p-1.5">
              <DropdownMenuItem danger onClick={() => logout()} className="gap-2.5 px-3 py-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
};

export default Header;