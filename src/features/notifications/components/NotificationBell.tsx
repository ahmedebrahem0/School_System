// features/notifications/components/NotificationBell.tsx

"use client";

import { Bell, Inbox, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationBellSkeleton } from "./NotificationBell.skeleton";
import { NotificationListItem } from "./NotificationListItem";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    totalCount,
    isLoading,
    isError,
    isMarkingRead,
    isMarkingAllRead,
    isDeleting,
    markRead,
    markAllRead,
    deleteNotification,
    retry,
  } = useNotifications();
  const isMutating = isMarkingRead || isMarkingAllRead || isDeleting;

  return (
    <DropdownMenu>
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
            <span
              className={cn(
                "absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full",
                "bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white"
              )}
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[min(380px,calc(100vw-24px))] p-0 overflow-hidden dark:bg-[#111827] dark:border-white/10"
      >
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-white/10">
          <div>
            <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
              Notifications
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              {totalCount} total · {unreadCount} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              disabled={isMarkingAllRead}
              className="text-[12px] font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 dark:text-blue-400"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto p-1.5">
          {isLoading && <NotificationBellSkeleton />}

          {!isLoading && isError && (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200">
                Could not load notifications
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-600 dark:text-blue-400"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && notifications.length === 0 && (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <Inbox className="h-8 w-8 text-zinc-300" aria-hidden="true" />
              <p className="mt-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300">
                No notifications yet
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">
                New school activity will appear here.
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            notifications.map((item) => (
              <NotificationListItem
                key={item.id}
                item={item}
                disabled={isMutating}
                onRead={(notification) => void markRead(notification)}
                onDelete={(notification) => void deleteNotification(notification)}
              />
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
