import { useMemo, useState } from "react";
import { paginate, type PaginatedResult } from "@/types/api.types";
import { useGetTimetablesQuery } from "../api";
import type { Timetable } from "../types";

interface useTimetablesOptions {
  limit?: number;
}

interface useTimetablesReturn {
  result: PaginatedResult<Timetable>;
  timetables: Timetable[];
  allTimetables: Timetable[];
  filteredTimetables: Timetable[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  page: number;
  setPage: (page: number) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  refetch: () => void;
}

export const useTimetables = (
  options: useTimetablesOptions = {}
): useTimetablesReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTimetablesQuery();

  const filteredTimetables = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (data ?? []).filter((timetable) => {
      const matchesSearch = query
        ? timetable.dayOfWeek.toLowerCase().includes(query) ||
          timetable.classId.toString().includes(query) ||
          timetable.subjectId.toString().includes(query)
        : true;

      return matchesSearch;
    });
  }, [data, searchQuery]);

  const result = useMemo(
    () => paginate(filteredTimetables, { page, limit }),
    [filteredTimetables, page, limit]
  );

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQueryState("");
    setPage(1);
  };

  return {
    result,
    timetables: result.data,
    allTimetables: data ?? [],
    filteredTimetables,
    isLoading,
    isFetching,
    isError,
    searchQuery,
    setSearchQuery: resetPage(setSearchQueryState),
    page,
    setPage,
    hasActiveFilters: Boolean(searchQuery.trim()),
    clearFilters,
    refetch,
  };
};
