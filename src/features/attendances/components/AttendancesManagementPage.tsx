"use client";

import { useMemo, useState } from "react";
import { CalendarDays, FilterX, Plus, Search } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_ATTENDANCE_STATUSES } from "@/constants/attendance-status";
import { useAttendances } from "../hooks/useAttendances";
import { AttendanceCalendar } from "./AttendanceCalendar";
import { AttendanceForm } from "./AttendanceForm";
import { AttendanceStats } from "./AttendanceStats";
import { AttendanceTable } from "./AttendanceTable";
import { AttendanceTableSkeleton } from "./AttendanceTable.skeleton";

const isDateValue = (value: string | undefined): value is string =>
  Boolean(value);

interface AttendancesManagementPageProps {
  title?: string;
  subtitle?: string;
  teacherMode?: boolean;
}

export function AttendancesManagementPage({
  title = "Attendances",
  subtitle = "Manage daily student attendance records",
  teacherMode = false,
}: AttendancesManagementPageProps) {
  const [showForm, setShowForm] = useState(false);
  const {
    result,
    attendances,
    allAttendances,
    filteredAttendances,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    hasActiveFilters,
    clearFilters,
    setPage,
    refetch,
  } = useAttendances();

  const dates = useMemo(
    () =>
      Array.from(
        new Set(
          allAttendances
            .map((attendance) => attendance.date?.slice(0, 10))
            .filter(isDateValue)
        )
      ).sort((first, second) => second.localeCompare(first)),
    [allAttendances]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        count={filteredAttendances.length}
        actions={
          !teacherMode && (
            <Button onClick={() => setShowForm((current) => !current)}>
              <Plus className="h-4 w-4" />
              {showForm ? "Close Form" : "Add Attendance"}
            </Button>
          )
        }
      />

      <AttendanceStats attendances={filteredAttendances} />

      {showForm && !teacherMode && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Record attendance</CardTitle>
              <CardDescription>
                Choose a student, date, and attendance status.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AttendanceForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent attendance days</CardTitle>
            <CardDescription>
              A compact daily view of present, late, and absent records.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AttendanceTableSkeleton readOnly />
          ) : isError ? (
            <ErrorMessage
              title="Attendance calendar could not be loaded"
              description={
                teacherMode
                  ? "The backend currently blocks this attendance list for teacher accounts."
                  : "Attendance records are unavailable right now."
              }
              onRetry={refetch}
            />
          ) : filteredAttendances.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-8 w-8 text-zinc-400" />}
              title="No attendance days found"
              description="Daily summaries will appear after records are added."
            />
          ) : (
            <AttendanceCalendar attendances={filteredAttendances} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="items-start gap-4 md:flex-row">
          <div>
            <CardTitle>Attendance records</CardTitle>
            <CardDescription>
              Search by student, filter by status, or focus on one date.
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
          <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search attendances..."
              leftIcon={<Search size={15} />}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ALL_ATTENDANCE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter || "all"} onValueChange={(value) => setDateFilter(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                {dates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <AttendanceTableSkeleton />
          ) : isError ? (
            <ErrorMessage
              title="Attendances could not be loaded"
              description={
                teacherMode
                  ? "The backend returned 403 for teacher accounts on this list endpoint."
                  : "Attendance records are unavailable right now."
              }
              onRetry={refetch}
            />
          ) : attendances.length === 0 ? (
            <EmptyState
              title="No attendance records found"
              description="Try changing filters or add the first attendance record."
            />
          ) : (
            <>
              <AttendanceTable attendances={attendances} readOnly={teacherMode} />
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
