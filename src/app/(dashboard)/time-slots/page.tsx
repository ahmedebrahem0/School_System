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
import { useTimeSlots } from "@/features/timeSlots/hooks/useTimeSlots";
import { TimeSlotTable } from "@/features/timeSlots/components/TimeSlotTable";
import { TimeSlotTableSkeleton } from "@/features/timeSlots/components/TimeSlotTable.skeleton";
import { TimeSlotForm } from "@/features/timeSlots/components/TimeSlotForm";

export default function TimeSlotsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    result,
    timeSlots,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    clearFilters,
    setPage,
    refetch,
  } = useTimeSlots();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Slots"
        subtitle="Manage class time periods and schedules"
        count={timeSlots.length}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            + New Time Slot
          </Button>
        }
      />

      <Card>
        <CardHeader className="items-start gap-4 md:flex-row">
          <div>
            <CardTitle>All time slots</CardTitle>
            <CardDescription>
              Search by start or end time.
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
              placeholder="Search time slots..."
              leftIcon={<Search size={15} />}
            />
          </div>

          {isLoading ? (
            <TimeSlotTableSkeleton />
          ) : isError ? (
            <ErrorMessage
              title="Time slots could not be loaded"
              description="Failed to fetch time slots. Please try again."
              onRetry={refetch}
            />
          ) : timeSlots.length === 0 ? (
            <EmptyState
              title="No time slots found"
              description="Create a new time slot to get started."
            />
          ) : (
            <>
              <TimeSlotTable timeSlots={timeSlots} />
              {result.totalPages > 1 && (
                <Pagination result={result} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <TimeSlotForm
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
}
