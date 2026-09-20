// features/notifications/components/NotificationBell.tsx

// Header bell icon — shows a badge for new grade/attendance records
// since the last visit (see useNotifications for how "new" is derived).

"use client";

import { Bell, CalendarCheck, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <DropdownMenu onOpenChange={(open) => !open && markAllRead()}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative flex items-center justify-center w-9 h-9 rounded-lg",
            "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10",
            "transition-colors duration-150 outline-none"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[320px] p-0 overflow-hidden dark:bg-[#111827] dark:border-white/10"
      >
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-white/10">
          <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
            Notifications
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            New activity since your last visit
          </p>
        </div>

        <div className="max-h-[320px] overflow-y-auto p-1.5">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-zinc-400">
              No new notifications.
            </p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg"
              >
                {item.title.toLowerCase().includes("attendance") ? (
                  <CalendarCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100 truncate">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
