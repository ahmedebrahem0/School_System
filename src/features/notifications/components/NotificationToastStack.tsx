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
  UserRoundCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { NotificationItem } from "../types";

interface NotificationToastStackProps {
  items: NotificationItem[];
  exitingIds: Set<string>;
  onOpen: (item: NotificationItem) => void;
  onDismiss: (id: string) => void;
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
  Low: "border-l-zinc-400 bg-zinc-100 text-zinc-600 dark:bg-zinc-700/80 dark:text-zinc-200",
  Normal: "border-l-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
  High: "border-l-amber-500 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
  Urgent: "border-l-red-500 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200",
} as const;

function createdAtLabel(value: string | null) {
  if (!value) return "New notification";
  const date = new Date(value);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : "New notification";
}

export function NotificationToastStack({
  items,
  exitingIds,
  onOpen,
  onDismiss,
}: NotificationToastStackProps) {
  if (items.length === 0) return null;

  return (
    <aside
      className="pointer-events-none fixed inset-x-3 top-20 z-40 flex flex-col sm:left-auto sm:right-5 sm:w-[min(380px,calc(100vw-2.5rem))] lg:right-7"
      aria-label="New notifications"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {items[items.length - 1]?.title}
      </div>

      {items.map((item, index) => {
        const Icon = iconByType[item.type] ?? BellRing;
        return (
          <div
            key={item.id}
            className={cn(
              "notification-toast-row grid transition-[grid-template-rows,opacity,transform,margin] duration-200 ease-out",
              exitingIds.has(item.id) && "notification-toast-row-exit"
            )}
            style={{
              "--toast-depth": `${index * 4}px`,
              "--toast-scale": String(1 - index * 0.008),
              zIndex: items.length - index,
            } as React.CSSProperties}
          >
          <article
            className={cn(
              "notification-toast-in pointer-events-auto relative min-h-0 overflow-hidden rounded-xl border border-zinc-200/90 border-l-[3px]",
              "bg-white/95 shadow-[0_14px_40px_-18px_rgba(15,23,42,0.45)] backdrop-blur-md",
              "dark:border-y-slate-700 dark:border-r-slate-700 dark:bg-[#111b2e]/95 dark:shadow-black/40",
              priorityStyles[item.priority]
            )}
          >
            <button
              type="button"
              className="flex w-full items-start gap-3 bg-white/85 px-3.5 py-3.5 pr-11 text-left outline-none transition-colors hover:bg-blue-50/55 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:bg-[#111b2e]/95 dark:hover:bg-slate-800"
              onClick={() => onOpen(item)}
              aria-label={`Open notification: ${item.title}`}
            >
              <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", priorityStyles[item.priority])}>
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  {item.title}
                </span>
                <span className="mt-0.5 block line-clamp-2 text-xs leading-[1.15rem] text-slate-600 dark:text-slate-300">
                  {item.message}
                </span>
                <span className="mt-1.5 block text-[11px] font-medium tracking-[0.025em] text-slate-600 dark:text-slate-400">
                  {createdAtLabel(item.createdAtUtc)}
                </span>
              </span>
            </button>

            <button
              type="button"
              className="absolute right-2.5 top-2.5 rounded-md p-1.5 text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => onDismiss(item.id)}
              aria-label={`Dismiss ${item.title}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </article>
          </div>
        );
      })}
    </aside>
  );
}
