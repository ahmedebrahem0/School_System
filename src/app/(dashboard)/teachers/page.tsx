// app/(dashboard)/teachers/page.tsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { TeacherTable } from "@/features/teachers/components/TeacherTable";
import { TeacherTableSkeleton } from "@/features/teachers/components/TeacherTable.skeleton";
import { useTeachers } from "@/features/teachers/hooks/useTeachers";
import { ROUTES } from "@/constants/routes";

export default function TeachersPage() {
  const {
    result,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    setPage,
    refetch,
  } = useTeachers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        subtitle="Manage all teachers in the system"
        count={result.total}
        actions={
          <Link href={ROUTES.TEACHERS.CREATE}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Teacher
            </Button>
          </Link>
        }
      />

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <input
          type="text"
          placeholder="Search teachers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {isLoading ? (
        <TeacherTableSkeleton />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : result.data.length === 0 ? (
        <EmptyState title="No teachers found" />
      ) : (
        <>
          <TeacherTable teachers={result.data} />
          {result.totalPages > 1 && (
            <Pagination result={result} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}

