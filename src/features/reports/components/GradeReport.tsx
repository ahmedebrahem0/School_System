"use client";

import { Award, BarChart3, Target, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGradeReport } from "../hooks/useReports";
import { GradeReportSkeleton } from "./GradeReport.skeleton";

export function GradeReport() {
  const { stats, isLoading, isError, refetch } = useGradeReport();

  if (isLoading) {
    return <GradeReportSkeleton />;
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <BarChart3 className="size-4 text-blue-600" />
            Total Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900">{stats.totalGrades}</div>
          <p className="mt-1 text-xs text-zinc-500">Recorded entries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <Target className="size-4 text-teal-600" />
            Average Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-600">
            {stats.averageGrade.toFixed(1)}
          </div>
          <p className="mt-1 text-xs text-zinc-500">Out of 100</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <Award className="size-4 text-emerald-600" />
            Passing Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {stats.passingRate.toFixed(1)}%
          </div>
          <p className="mt-1 text-xs text-zinc-500">60+ score</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <TrendingUp className="size-4 text-amber-600" />
            Highest Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{stats.highestGrade}</div>
          <p className="mt-1 truncate text-xs text-zinc-500">{stats.topPerformer}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <TrendingDown className="size-4 text-red-600" />
            Lowest Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.lowestGrade}</div>
          <p className="mt-1 text-xs text-zinc-500">Needs follow-up</p>
        </CardContent>
      </Card>
    </div>
  );
}
