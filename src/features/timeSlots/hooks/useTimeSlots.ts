import { useMemo, useState } from "react";
import { paginate, type PaginatedResult } from "@/types/api.types";
import { useGetTimeSlotsQuery } from "../api";
import type { TimeSlot } from "../types";

interface useTimeSlotsOptions {
  limit?: number;
}

interface useTimeSlotsReturn {
  result: PaginatedResult<TimeSlot>;
  timeSlots: TimeSlot[];
  allTimeSlots: TimeSlot[];
  filteredTimeSlots: TimeSlot[];
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

export const useTimeSlots = (
  options: useTimeSlotsOptions = {}
): useTimeSlotsReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTimeSlotsQuery();

  const filteredTimeSlots = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (data ?? []).filter((timeSlot) => {
      const matchesSearch = query
        ? timeSlot.startTime.toLowerCase().includes(query) ||
          timeSlot.endTime.toLowerCase().includes(query)
        : true;

      return matchesSearch;
    });
  }, [data, searchQuery]);

  const result = useMemo(
    () => paginate(filteredTimeSlots, { page, limit }),
    [filteredTimeSlots, page, limit]
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
    timeSlots: result.data,
    allTimeSlots: data ?? [],
    filteredTimeSlots,
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
