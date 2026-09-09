// app/(dashboard)/subjects/page.tsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { SubjectTable } from "@/features/subjects/components/SubjectTable";
import { SubjectTableSkeleton } from "@/features/subjects/components/SubjectTable.skeleton";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { ROUTES } from "@/constants/routes";

export default function SubjectsPage() {
  const {
    result,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    refetch,
  } = useSubjects();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        subtitle="Manage all subjects in the system"
        count={result.total}
        actions={
          <Link href={ROUTES.SUBJECTS.CREATE}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-zinc-200 p-4">
        <input
          type="text"
          placeholder="Search subjects by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {isLoading ? (
        <SubjectTableSkeleton />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : result.data.length === 0 ? (
        <EmptyState title="No subjects found" />
      ) : (
        <>
          <SubjectTable subjects={result.data} />
          {result.totalPages > 1 && (
            <Pagination result={result} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
