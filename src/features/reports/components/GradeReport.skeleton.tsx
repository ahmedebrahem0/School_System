import { Skeleton } from "@/components/ui/skeleton";

export function GradeReportSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-32 rounded-[10px]" />
      ))}
    </div>
  );
}
