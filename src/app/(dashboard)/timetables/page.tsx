"use client";

import { FilterX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import { useState, useMemo } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROLES } from "@/constants/roles";
import { useTimetables } from "@/features/timetables/hooks/useTimetables";
import { useMyTimetable } from "@/features/timetables/hooks/useMyTimetable";
import { TimetableTable } from "@/features/timetables/components/TimetableTable";
import { TimetableTableSkeleton } from "@/features/timetables/components/TimetableTable.skeleton";
import { TimetableForm } from "@/features/timetables/components/TimetableForm";
import { useGetClassesQuery } from "@/features/classes/api";
import { useGetSubjectsQuery } from "@/features/subjects/api";
import { useGetClassroomsQuery } from "@/features/classrooms/api";
import { useGetTimeSlotsQuery } from "@/features/timeSlots/api";

export default function TimetablesPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <TimetableTableSkeleton readOnly />;
  }

  if (user.role !== ROLES.ADMIN) {
    return <MyTimetablesPage />;
  }

  return <ManageTimetablesPage />;
}

function ManageTimetablesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    result,
    timetables,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    clearFilters,
    setPage,
    refetch,
  } = useTimetables();

  const { data: classes = [] } = useGetClassesQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();
  const { data: classrooms = [] } = useGetClassroomsQuery();
  const { data: timeSlots = [] } = useGetTimeSlotsQuery();

  const classesMap = useMemo(
    () => Object.fromEntries(classes.map((c) => [c.classId, c.className])),
    [classes]
  );

  const subjectsMap = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.subjectId, s.subjectName])),
    [subjects]
  );

  const classroomsMap = useMemo(
    () => Object.fromEntries(classrooms.map((r) => [r.classroomId, r.roomNumber])),
    [classrooms]
  );

  const timeSlotsMap = useMemo(
    () =>
      Object.fromEntries(
        timeSlots.map((t) => [t.timeSlotId, `${t.startTime} - ${t.endTime}`])
      ),
    [timeSlots]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetables"
        subtitle="Manage class schedules and time assignments"
        count={timetables.length}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            + New Timetable Entry
          </Button>
        }
      />

      <Card>
        <CardHeader className="items-start gap-4 md:flex-row">
          <div>
            <CardTitle>All timetable entries</CardTitle>
            <CardDescription>
              Search by class, subject, or day.
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search timetables..."
              leftIcon={<Search size={15} />}
            />
          </div>

          {isLoading ? (
            <TimetableTableSkeleton />
          ) : isError ? (
            <ErrorMessage
              title="Timetables could not be loaded"
              description="Failed to fetch timetable entries. Please try again."
              onRetry={refetch}
            />
          ) : timetables.length === 0 ? (
            <EmptyState
              title="No timetable entries found"
              description="Create a new timetable entry to get started."
            />
          ) : (
            <>
              <TimetableTable
                timetables={timetables}
                classesMap={classesMap}
                subjectsMap={subjectsMap}
                classroomsMap={classroomsMap}
                timeSlotsMap={timeSlotsMap}
              />
              {result.totalPages > 1 && (
                <Pagination result={result} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <TimetableForm
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
}

function MyTimetablesPage() {
  const {
    result,
    timetables,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    clearFilters,
    setPage,
    refetch,
  } = useMyTimetable();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        subtitle="View your assigned schedule"
        count={timetables.length}
      />

      <Card>
        <CardHeader className="items-start gap-4 md:flex-row">
          <div>
            <CardTitle>Assigned timetable</CardTitle>
            <CardDescription>Search your schedule by day.</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search timetable..."
            leftIcon={<Search size={15} />}
          />

          {isLoading ? (
            <TimetableTableSkeleton readOnly />
          ) : isError ? (
            <ErrorMessage
              title="Timetable could not be loaded"
              description="Failed to fetch your timetable. Please try again."
              onRetry={refetch}
            />
          ) : timetables.length === 0 ? (
            <EmptyState
              title="No timetable entries found"
              description="Your assigned timetable will appear here."
            />
          ) : (
            <>
              <TimetableTable timetables={timetables} readOnly />
              {result.totalPages > 1 && (
                <Pagination result={result} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
