// components/common/PageSkeleton.tsx

// Skeleton for page header — used while page data is loading
// Matches the shape of PageHeader component exactly

import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => {
  return (
    <div className="pb-6 mb-6 border-b border-zinc-200">
      <div className="flex items-start justify-between">

        {/* Left — Title + Badge */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Right — Action Button */}
        <Skeleton className="h-9 w-32 rounded-lg" />

      </div>
    </div>
  );
};

export default PageSkeleton;