"use client";

import { CalendarCheck, Clock, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useAttendanceReport } from "../hooks/useReports";
import { AttendanceReportSkeleton } from "./AttendanceReport.skeleton";

export function AttendanceReport() {
  const { stats, isLoading, isError, refetch } = useAttendanceReport();

  if (isLoading) {
    return <AttendanceReportSkeleton />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load attendance report"
        description="Unable to fetch attendance data"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <CalendarCheck className="size-4 text-blue-600" />
            Total Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900">{stats.totalRecords}</div>
          <p className="mt-1 text-xs text-zinc-500">Attendance entries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <UserCheck className="size-4 text-emerald-600" />
            Present
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{stats.present}</div>
          <p className="mt-1 text-xs text-zinc-500">
            {stats.presentPercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <UserX className="size-4 text-red-600" />
            Absent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          <p className="mt-1 text-xs text-zinc-500">
            {stats.absentPercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <Clock className="size-4 text-amber-600" />
            Late
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
          <p className="mt-1 text-xs text-zinc-500">
            {stats.latePercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
