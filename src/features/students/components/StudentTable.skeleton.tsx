import { Skeleton } from "@/components/ui/skeleton"

export function StudentTableSkeleton() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-200 shadow-sm overflow-hidden">
      {/* Filter bar skeleton */}
      <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
        <Skeleton className="h-10 w-[280px] rounded-[8px]" />
        <Skeleton className="h-10 w-[160px] rounded-[8px]" />
        <Skeleton className="h-10 w-[140px] rounded-[8px]" />
        <div className="ml-auto">
          <Skeleton className="h-10 w-[130px] rounded-[8px]" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["w-10", "w-48", "w-32", "w-28", "w-24"].map((w, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className={`h-3 ${w}`} />
                </th>
              ))}
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-zinc-100">
                {/* # */}
                <td className="px-4 py-3">
                  <Skeleton className="h-3.5 w-6" />
                </td>
                {/* Student Name + avatar */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </td>
                {/* Date of Birth */}
                <td className="px-4 py-3">
                  <Skeleton className="h-3.5 w-24" />
                </td>
                {/* Class badge */}
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8 rounded-[8px]" />
                    <Skeleton className="h-8 w-8 rounded-[8px]" />
                    <Skeleton className="h-8 w-8 rounded-[8px]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100">
        <Skeleton className="h-3.5 w-40" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-[6px]" />
          ))}
        </div>
      </div>
    </div>
  )
}