"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStudentsQuery } from "@/features/students/api";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/common/ErrorMessage";

interface GradeStats {
  totalStudents: number;
  averageGrade: number;
  topPerformer: string;
  passingRate: number;
}

export function GradeReport() {
  const { data: students = [], isLoading, isError, refetch } = useGetStudentsQuery();

  const stats = useMemo<GradeStats>(() => {
    const totalStudents = students.length;
    // Mock grade data — in real app would come from /api/Grades
    const averageGrade = 78;
    const passingRate = 92;

    return {
      totalStudents,
      averageGrade,
      topPerformer: "Ali Ahmed",
      passingRate,
    };
  }, [students]);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded" />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load grade report"
        description="Unable to fetch grade data"
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
          <div className="text-2xl font-bold text-zinc-900">{stats.totalStudents}</div>
          <p className="text-xs text-zinc-500 mt-1">Evaluated</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-600">Average Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.averageGrade}</div>
          <p className="text-xs text-zinc-500 mt-1">Out of 100</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-600">Passing Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.passingRate}%</div>
          <p className="text-xs text-zinc-500 mt-1">60+ Score</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-600">Top Performer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold text-zinc-900 truncate">{stats.topPerformer}</div>
          <p className="text-xs text-zinc-500 mt-1">Highest Score</p>
        </CardContent>
      </Card>
    </div>
  );
}
