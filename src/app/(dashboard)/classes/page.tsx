// app/(dashboard)/classes/page.tsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { ClassGrid } from "@/features/classes/components/ClassGrid";
import { ClassGridSkeleton } from "@/features/classes/components/ClassGrid.skeleton";
import { useClasses } from "@/features/classes/hooks/useClasses";
import { ROUTES } from "@/constants/routes";

export default function ClassesPage() {
  const {
    result,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    refetch,
  } = useClasses();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        subtitle="Manage all classes in the system"
        count={result.total}
        actions={
          <Link href={ROUTES.CLASSES.CREATE}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Class
            </Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-zinc-200 p-4">
        <input
          type="text"
          placeholder="Search classes by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {isLoading ? (
        <ClassGridSkeleton />
      ) : isError ? (
        <ErrorMessage onRetry={refetch} />
      ) : result.data.length === 0 ? (
        <EmptyState title="No classes found" />
      ) : (
        <>
          <ClassGrid classes={result.data} />
          {result.totalPages > 1 && (
            <Pagination result={result} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}