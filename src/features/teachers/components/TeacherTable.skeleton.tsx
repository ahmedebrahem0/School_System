// features/teachers/components/TeacherTable.skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function TeacherTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
              Name
            </th>
            <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
              Subjects
            </th>
            <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
              Classes
            </th>
            <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-zinc-100">
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-32 rounded" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-16 rounded" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-16 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
