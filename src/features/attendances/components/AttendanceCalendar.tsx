"use client";

import { useMemo } from "react";
import { format, isValid, parseISO } from "date-fns";
import { ATTENDANCE_STATUS } from "@/constants/attendance-status";
import type { Attendance } from "../types";

interface AttendanceCalendarProps {
  attendances: Attendance[];
}

const dayClass = {
  [ATTENDANCE_STATUS.PRESENT]: "border-emerald-200 bg-emerald-50 text-emerald-700",
  [ATTENDANCE_STATUS.ABSENT]: "border-red-200 bg-red-50 text-red-700",
  [ATTENDANCE_STATUS.LATE]: "border-amber-200 bg-amber-50 text-amber-700",
};

const formatDay = (date: string, pattern: string) => {
  const parsed = parseISO(date);

  return isValid(parsed) ? format(parsed, pattern) : "N/A";
};

export function AttendanceCalendar({ attendances }: AttendanceCalendarProps) {
  const days = useMemo(() => {
    const grouped = new Map<string, Attendance[]>();

    attendances.forEach((attendance) => {
      const key = attendance.date?.slice(0, 10);
      if (!key) return;
      grouped.set(key, [...(grouped.get(key) ?? []), attendance]);
    });

    return Array.from(grouped.entries())
      .sort(([first], [second]) => second.localeCompare(first))
      .slice(0, 14);
  }, [attendances]);

  if (days.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
      {days.map(([date, records]) => {
        const present = records.filter(
          (record) => record.status === ATTENDANCE_STATUS.PRESENT
        ).length;
        const late = records.filter(
          (record) => record.status === ATTENDANCE_STATUS.LATE
        ).length;
        const absent = records.filter(
          (record) => record.status === ATTENDANCE_STATUS.ABSENT
        ).length;
        const dominant =
          absent > 0
            ? ATTENDANCE_STATUS.ABSENT
            : late > 0
            ? ATTENDANCE_STATUS.LATE
            : ATTENDANCE_STATUS.PRESENT;

        return (
          <div
            key={date}
            className={`rounded-lg border p-3 ${dayClass[dominant]}`}
          >
            <p className="text-[12px] font-medium uppercase">
              {formatDay(date, "EEE")}
            </p>
            <p className="mt-1 font-mono text-[18px] font-semibold">
              {formatDay(date, "dd")}
            </p>
            <p className="text-[12px]">{formatDay(date, "MMM yyyy")}</p>
            <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[11px]">
              <span>{present} P</span>
              <span>{late} L</span>
              <span>{absent} A</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
