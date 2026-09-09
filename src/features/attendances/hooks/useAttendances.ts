import { useMemo, useState } from "react";
import { paginate, type PaginatedResult } from "@/types/api.types";
import { useGetAttendancesQuery } from "../api";
import type { Attendance } from "../types";

interface UseAttendancesOptions {
  limit?: number;
}

interface UseAttendancesReturn {
  result: PaginatedResult<Attendance>;
  attendances: Attendance[];
  allAttendances: Attendance[];
  filteredAttendances: Attendance[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  page: number;
  setPage: (page: number) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  refetch: () => void;
}

export const useAttendances = (
  options: UseAttendancesOptions = {}
): UseAttendancesReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("all");
  const [dateFilter, setDateFilterState] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAttendancesQuery();

  const filteredAttendances = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (data ?? []).filter((attendance) => {
      const matchesSearch = query
        ? (attendance.studentName ?? "").toLowerCase().includes(query) ||
          String(attendance.studentId).includes(query) ||
          (attendance.status ?? "").toLowerCase().includes(query)
        : true;
      const matchesStatus =
        statusFilter === "all" ? true : attendance.status === statusFilter;
      const matchesDate = dateFilter
        ? attendance.date?.slice(0, 10) === dateFilter
        : true;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [data, searchQuery, statusFilter, dateFilter]);

  const result = useMemo(
    () => paginate(filteredAttendances, { page, limit }),
    [filteredAttendances, page, limit]
  );

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQueryState("");
    setStatusFilterState("all");
    setDateFilterState("");
    setPage(1);
  };

  return {
    result,
    attendances: result.data,
    allAttendances: data ?? [],
    filteredAttendances,
    isLoading,
    isFetching,
    isError,
    searchQuery,
    setSearchQuery: resetPage(setSearchQueryState),
    statusFilter,
    setStatusFilter: resetPage(setStatusFilterState),
    dateFilter,
    setDateFilter: resetPage(setDateFilterState),
    page,
    setPage,
    hasActiveFilters:
      Boolean(searchQuery.trim()) || statusFilter !== "all" || Boolean(dateFilter),
    clearFilters,
    refetch,
  };
};
