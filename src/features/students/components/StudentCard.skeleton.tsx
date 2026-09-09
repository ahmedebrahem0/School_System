import { Skeleton } from "@/components/ui/skeleton";

export function StudentCardSkeleton() {
  return (
    <div className="rounded-[10px] border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-[8px]" />
        <Skeleton className="h-16 rounded-[8px]" />
        <Skeleton className="h-16 rounded-[8px]" />
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
