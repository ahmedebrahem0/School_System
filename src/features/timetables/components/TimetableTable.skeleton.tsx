import { Skeleton } from "@/components/ui/skeleton";

interface TimetableTableSkeletonProps {
  readOnly?: boolean;
}

export function TimetableTableSkeleton({
  readOnly = false,
}: TimetableTableSkeletonProps) {
  const headings = readOnly
    ? ["Class", "Subject", "Day", "Time", "Classroom"]
    : ["Class", "Subject", "Day", "Time", "Classroom", "Actions"];

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            {headings.map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b border-zinc-100">
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20 rounded" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24 rounded" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20 rounded" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20 rounded" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20 rounded" />
              </td>
              {!readOnly && (
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
