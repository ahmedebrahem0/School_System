// components/common/Pagination.tsx

// Reusable pagination component
// Works with the paginate() function from types/api.types.ts
// All pagination is client-side — backend returns all data at once

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import type { PaginatedResult } from "@/types/api.types";

// ─────────────────────────────────────────────────────
// PAGINATION PROPS
// ─────────────────────────────────────────────────────
interface PaginationProps<T> {
  result: PaginatedResult<T>;
  onPageChange: (page: number) => void;
}

// ─────────────────────────────────────────────────────
// PAGINATION COMPONENT
// ─────────────────────────────────────────────────────
const Pagination = <T,>({ result, onPageChange }: PaginationProps<T>) => {
  const { page, totalPages, total, limit } = result;

  // Calculate showing range
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page numbers to show
  // Always show: first, last, current, and 1 around current
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (page > 3) pages.push("...");

    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100">

      {/* Left — Showing info */}
      <p className="text-[13px] text-zinc-500">
        Showing{" "}
        <span className="font-medium text-zinc-700">{from}–{to}</span>
        {" "}of{" "}
        <span className="font-medium text-zinc-700">{total}</span>
        {" "}results
      </p>

      {/* Right — Page buttons */}
      <div className="flex items-center gap-1">

        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 p-0 border-zinc-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span
              key={`dots-${index}`}
              className="h-8 w-8 flex items-center justify-center text-[13px] text-zinc-400"
            >
              ...
            </span>
          ) : (
            <Button
              key={pageNum}
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageNum as number)}
              className={cn(
                "h-8 w-8 p-0 text-[13px] border-zinc-200",
                page === pageNum && [
                  "bg-[#1E3A8A] text-white border-[#1E3A8A]",
                  "hover:bg-[#1D4ED8] hover:border-[#1D4ED8]",
                ]
              )}
            >
              {pageNum}
            </Button>
          )
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="h-8 w-8 p-0 border-zinc-200"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

      </div>

    </div>
  );
};

export default Pagination;