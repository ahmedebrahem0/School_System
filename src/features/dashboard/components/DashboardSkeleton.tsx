import { Skeleton } from "@/components/ui/skeleton";
import { StaggerItem } from "@/components/common/StaggerItem";

// Mirrors the full shape of a role dashboard (4-stat grid, 3-stat grid,
// quick actions card, activity card) so the loading state doesn't look
// like a tiny fraction of the real page — same stagger feel as the
// loaded content underneath it.

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-11 w-11 rounded-[10px]" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StaggerItem key={i} index={i}>
            <StatCardSkeleton />
          </StaggerItem>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StaggerItem key={i} index={4 + i}>
            <StatCardSkeleton />
          </StaggerItem>
        ))}
      </div>

      <StaggerItem index={7}>
        <div className="bg-white rounded-[10px] border border-zinc-200 p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-[8px]" />
            ))}
          </div>
        </div>
      </StaggerItem>

      <StaggerItem index={8}>
        <div className="bg-white rounded-[10px] border border-zinc-200 p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-[8px]" />
            ))}
          </div>
        </div>
      </StaggerItem>
    </div>
  );
}
