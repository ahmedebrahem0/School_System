"use client";

import { BookOpen, Users } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyTeacherClassesQuery, useGetMyTeacherSubjectsQuery } from "@/features/teachers/api";

export default function Page() {
  const classesQuery = useGetMyTeacherClassesQuery();
  const subjectsQuery = useGetMyTeacherSubjectsQuery();
  const isLoading = classesQuery.isLoading || subjectsQuery.isLoading;
  const isError = classesQuery.isError || subjectsQuery.isError;
  const classes = classesQuery.data ?? [];
  const subjects = subjectsQuery.data ?? [];

  const refetch = () => {
    classesQuery.refetch();
    subjectsQuery.refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        subtitle="Review the classes and subjects assigned to your account"
        count={classes.length}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-36 rounded-[10px] bg-zinc-100" />
          ))}
        </div>
      ) : isError ? (
        <ErrorMessage
          title="Teacher classes could not be loaded"
          description="Failed to fetch your assigned classes and subjects."
          onRetry={refetch}
        />
      ) : classes.length === 0 && subjects.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Assigned classes and subjects will appear here."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4 text-teal-600" />
                Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {classes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[8px] border border-zinc-200 p-4"
                >
                  <span className="text-sm font-medium text-zinc-900">{item.name}</span>
                  <Badge variant="accent">ID {item.id}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-4 text-amber-600" />
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjects.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[8px] border border-zinc-200 p-4"
                >
                  <span className="text-sm font-medium text-zinc-900">{item.name}</span>
                  <Badge variant="warning">ID {item.id}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

