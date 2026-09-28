import { Skeleton } from "@/components/ui/skeleton";

export function NotificationBellSkeleton() {
  return (
    <div className="space-y-2 p-3" aria-label="Loading notifications">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex items-start gap-3 rounded-lg p-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
