"use client";

import { BookOpenCheck } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyGrades } from "../hooks/useMyGrades";
import { GradeStats } from "./GradeStats";
import { GradeTable } from "./GradeTable";
import { GradeTableSkeleton } from "./GradeTable.skeleton";

export function MyGradesPage() {
  const { grades, isLoading, isError, refetch } = useMyGrades();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Grades"
        subtitle="Track your subject scores and assessment progress"
        count={grades.length}
      />

      <GradeStats grades={grades} />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Subject report</CardTitle>
            <CardDescription>
              Your latest recorded grades by subject.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <GradeTableSkeleton readOnly />
          ) : isError ? (
            <ErrorMessage
              title="Grades could not be loaded"
              description="Your grade report is unavailable right now."
              onRetry={refetch}
            />
          ) : grades.length === 0 ? (
            <EmptyState
              icon={BookOpenCheck}
              title="No grades recorded yet"
              description="Your grades will appear here once they are published."
            />
          ) : (
            <GradeTable grades={grades} readOnly />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
