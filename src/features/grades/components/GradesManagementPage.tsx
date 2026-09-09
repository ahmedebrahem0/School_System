"use client";

import { useMemo, useState } from "react";
import { FilterX, Plus, Search } from "lucide-react";
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
import { useGrades } from "../hooks/useGrades";
import { GradeForm } from "./GradeForm";
import { GradeStats } from "./GradeStats";
import { GradeTable } from "./GradeTable";
import { GradeTableSkeleton } from "./GradeTable.skeleton";

interface GradesManagementPageProps {
  title?: string;
  subtitle?: string;
}

export function GradesManagementPage({
  title = "Grades",
  subtitle = "Manage student assessment records across subjects",
}: GradesManagementPageProps) {
  const [showForm, setShowForm] = useState(false);
  const {
    result,
    grades,
    allGrades,
    filteredGrades,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    subjectFilter,
    setSubjectFilter,
    studentFilter,
    setStudentFilter,
    hasActiveFilters,
    clearFilters,
    setPage,
    refetch,
  } = useGrades();

  const subjects = useMemo(
    () => Array.from(new Set(allGrades.map((grade) => grade.subjectName))).sort(),
    [allGrades]
  );
  const students = useMemo(
    () => Array.from(new Set(allGrades.map((grade) => grade.studentName))).sort(),
    [allGrades]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        count={filteredGrades.length}
        actions={
          <Button onClick={() => setShowForm((current) => !current)}>
            <Plus className="h-4 w-4" />
            {showForm ? "Close Form" : "Add Grade"}
          </Button>
        }
      />

      <GradeStats grades={filteredGrades} />

      {showForm && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Record grade</CardTitle>
              <CardDescription>
                Choose a student, subject, and score from 0 to 100.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <GradeForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="items-start gap-4 md:flex-row">
          <div>
            <CardTitle>Grade book</CardTitle>
            <CardDescription>
              Search by student, subject, or score and narrow the grade list.
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
          <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search grades..."
              leftIcon={<Search size={15} />}
            />
            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student} value={student}>
                    {student}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <GradeTableSkeleton />
          ) : isError ? (
            <ErrorMessage
              title="Grades could not be loaded"
              description="The grade book is unavailable right now."
              onRetry={refetch}
            />
          ) : grades.length === 0 ? (
            <EmptyState
              title="No grades found"
              description="Try changing filters or add the first grade record."
            />
          ) : (
            <>
              <GradeTable grades={grades} />
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
