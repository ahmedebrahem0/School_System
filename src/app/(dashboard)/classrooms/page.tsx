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
import { useState } from "react";
import { useClassrooms } from "@/features/classrooms/hooks/useClassrooms";
import { ClassroomTable } from "@/features/classrooms/components/ClassroomTable";
import { ClassroomTableSkeleton } from "@/features/classrooms/components/ClassroomTable.skeleton";
import { ClassroomForm } from "@/features/classrooms/components/ClassroomForm";

export default function ClassroomsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    result,
    classrooms,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    clearFilters,
    setPage,
    refetch,
  } = useClassrooms();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classrooms"
        subtitle="Manage classroom spaces and capacities"
        count={classrooms.length}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            + New Classroom
          </Button>
        }
      />

      <Card>
        <CardHeader className="items-start gap-4 md:flex-row">
          <div>
            <CardTitle>All classrooms</CardTitle>
            <CardDescription>
              Search by room number or capacity.
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
              placeholder="Search classrooms..."
              leftIcon={<Search size={15} />}
            />
          </div>

          {isLoading ? (
            <ClassroomTableSkeleton />
          ) : isError ? (
            <ErrorMessage
              title="Classrooms could not be loaded"
              description="Failed to fetch classrooms. Please try again."
              onRetry={refetch}
            />
          ) : classrooms.length === 0 ? (
            <EmptyState
              title="No classrooms found"
              description="Create a new classroom to get started."
            />
          ) : (
            <>
              <ClassroomTable classrooms={classrooms} />
              {result.totalPages > 1 && (
                <Pagination result={result} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ClassroomForm
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
}
