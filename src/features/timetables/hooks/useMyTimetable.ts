import { useMemo, useState } from "react";
import { paginate, type PaginatedResult } from "@/types/api.types";
import { useGetMyTimetableQuery } from "../api";
import type { Timetable } from "../types";

interface UseMyTimetableOptions {
  limit?: number;
}

export function useMyTimetable(options: UseMyTimetableOptions = {}) {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");
  const query = useGetMyTimetableQuery();

  const filteredTimetables = useMemo(() => {
    const value = searchQuery.trim().toLowerCase();

    return (query.data ?? []).filter((item) =>
      value ? item.dayOfWeek.toLowerCase().includes(value) : true
    );
  }, [query.data, searchQuery]);

  const result: PaginatedResult<Timetable> = useMemo(
    () => paginate(filteredTimetables, { page, limit }),
    [filteredTimetables, page, limit]
  );

  const setSearchQuery = (value: string) => {
    setSearchQueryState(value);
    setPage(1);
  };

  return {
    ...query,
    result,
    timetables: result.data,
    filteredTimetables,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    hasActiveFilters: Boolean(searchQuery.trim()),
    clearFilters: () => {
      setSearchQueryState("");
      setPage(1);
    },
  };
}
