import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-[10px]" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-[10px]" />
      <Skeleton className="h-56 rounded-[10px]" />
    </div>
  );
}
