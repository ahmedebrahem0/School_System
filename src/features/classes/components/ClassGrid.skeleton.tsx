// features/classes/components/ClassGrid.skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function ClassGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-zinc-200 p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-32 rounded mb-2" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="flex gap-2 pt-4 border-t border-zinc-200">
            <Skeleton className="h-8 flex-1 rounded" />
            <Skeleton className="h-8 flex-1 rounded" />
            <Skeleton className="h-8 flex-1 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}