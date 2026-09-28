"use client";

import { formatDistanceToNow, isValid } from "date-fns";
import {
  BellRing,
  BookOpenCheck,
  CalendarCheck,
  CalendarClock,
  GraduationCap,
  Megaphone,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { NotificationItem } from "../types";

interface NotificationListItemProps {
  item: NotificationItem;
  disabled?: boolean;
  onRead: (item: NotificationItem) => void;
  onDelete: (item: NotificationItem) => void;
}

const iconByType = {
  Announcement: Megaphone,
  GradeAdded: GraduationCap,
  GradeUpdated: GraduationCap,
  AttendanceRecorded: CalendarCheck,
  AbsenceWarning: CalendarCheck,
  ScheduleChanged: CalendarClock,
  ClassAssigned: UserRoundCheck,
  SubjectAssigned: BookOpenCheck,
  LessonReminder: CalendarClock,
  RoleChanged: ShieldCheck,
  UserPendingRole: UserRoundCheck,
  System: BellRing,
} as const;

const priorityStyles = {
  Low: "text-zinc-400",
  Normal: "text-blue-500",
  High: "text-amber-500",
  Urgent: "text-red-500",
} as const;

function formatCreatedAt(value: string) {
  const date = new Date(value);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : "Recently";
}

export function NotificationListItem({
  item,
  disabled = false,
  onRead,
  onDelete,
}: NotificationListItemProps) {
  const Icon = iconByType[item.type] ?? BellRing;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg px-3 py-2.5",
        "transition-colors hover:bg-zinc-50 dark:hover:bg-white/5",
        !item.isRead && "bg-blue-50/60 dark:bg-blue-500/10"
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={() => onRead(item)}
        disabled={disabled || item.isRead}
        aria-label={item.isRead ? item.title : `Mark ${item.title} as read`}
      >
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-white/10",
            priorityStyles[item.priority]
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 pr-7">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "truncate text-[13px] text-zinc-800 dark:text-zinc-100",
                item.isRead ? "font-medium" : "font-semibold"
              )}
            >
              {item.title}
            </span>
            {!item.isRead && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-blue-500"
                aria-label="Unread"
              />
            )}
          </span>
          <span className="mt-0.5 block line-clamp-2 text-[12px] leading-4 text-zinc-500 dark:text-zinc-400">
            {item.message}
          </span>
          <span className="mt-1 block text-[11px] text-zinc-400">
            {formatCreatedAt(item.createdAtUtc)}
          </span>
        </span>
      </button>

      <button
        type="button"
        className={cn(
          "absolute right-2 top-2 rounded-md p-1.5 text-zinc-400",
          "opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600",
          "focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
          "sm:opacity-0 sm:group-hover:opacity-100"
        )}
        onClick={() => onDelete(item)}
        disabled={disabled}
        aria-label={`Delete ${item.title}`}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
