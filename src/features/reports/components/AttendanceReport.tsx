"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStudentsQuery } from "@/features/students/api";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/common/ErrorMessage";

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  presentPercentage: number;
  absentPercentage: number;
}

export function AttendanceReport() {
  const { data: students = [], isLoading, isError, refetch } = useGetStudentsQuery();

  const stats = useMemo<AttendanceStats>(() => {
    const total = students.length;
    // Mock attendance data — in real app would come from /api/Attendances
    const present = Math.floor(total * 0.85);
    const absent = total - present;

    return {
      total,
      present,
      absent,
      presentPercentage: total > 0 ? (present / total) * 100 : 0,
      absentPercentage: total > 0 ? (absent / total) * 100 : 0,
    };
  }, [students]);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded" />;
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
          <CardTitle className="text-sm font-medium text-zinc-600">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900">{stats.total}</div>
          <p className="text-xs text-zinc-500 mt-1">Registered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-600">Present</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          <p className="text-xs text-zinc-500 mt-1">{stats.presentPercentage.toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-600">Absent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          <p className="text-xs text-zinc-500 mt-1">{stats.absentPercentage.toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-600">Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.presentPercentage.toFixed(1)}%
          </div>
          <p className="text-xs text-zinc-500 mt-1">Overall</p>
        </CardContent>
      </Card>
    </div>
  );
}
