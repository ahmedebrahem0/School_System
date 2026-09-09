"use client";

import { CalendarCheck, Clock, ListChecks, Percent, XCircle } from "lucide-react";
import { StatCard } from "@/components/ui/card";
import type { Attendance } from "../types";

interface AttendanceStatsProps {
  attendances: Attendance[];
}

export function summarizeAttendances(attendances: Attendance[]) {
  const present = attendances.filter((record) => record.status === "Present").length;
  const absent = attendances.filter((record) => record.status === "Absent").length;
  const late = attendances.filter((record) => record.status === "Late").length;
  const total = attendances.length;

  return {
    total,
    present,
    absent,
    late,
    attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
  };
}

export function AttendanceStats({ attendances }: AttendanceStatsProps) {
  const summary = summarizeAttendances(attendances);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Records"
        value={summary.total}
        icon={<ListChecks />}
        iconBg="#DBEAFE"
        iconColor="#1E3A8A"
      />
      <StatCard
        label="Attendance rate"
        value={`${summary.attendanceRate}%`}
        icon={<Percent />}
        iconBg="#CCFBF1"
        iconColor="#0F766E"
      />
      <StatCard
        label="Present"
        value={summary.present}
        icon={<CalendarCheck />}
        iconBg="#D1FAE5"
        iconColor="#047857"
      />
      <StatCard
        label="Late"
        value={summary.late}
        icon={<Clock />}
        iconBg="#FEF3C7"
        iconColor="#B45309"
      />
      <StatCard
        label="Absent"
        value={summary.absent}
        icon={<XCircle />}
        iconBg="#FEE2E2"
        iconColor="#B91C1C"
      />
    </div>
  );
}
