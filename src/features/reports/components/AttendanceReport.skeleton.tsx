import { Skeleton } from "@/components/ui/skeleton";

export function AttendanceReportSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-32 rounded-[10px]" />
      ))}
    </div>
  );
}
