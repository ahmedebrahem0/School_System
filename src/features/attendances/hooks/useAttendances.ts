import { useMemo, useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { paginate, type PaginatedResult } from "@/types/api.types";
import {
  useGetAttendancesQuery,
  useGetTeacherAttendancesQuery,
} from "../api";
import type { Attendance } from "../types";

interface UseAttendancesOptions {
  limit?: number;
  scope?: "admin" | "teacher";
}

interface UseAttendancesReturn {
  result: PaginatedResult<Attendance>;
  attendances: Attendance[];
  allAttendances: Attendance[];
  filteredAttendances: Attendance[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorStatus?: FetchBaseQueryError["status"];
  errorMessage?: string;
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
  const { limit = 10, scope = "admin" } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("all");
  const [dateFilter, setDateFilterState] = useState("");

  const adminQuery = useGetAttendancesQuery(undefined, {
    skip: scope === "teacher",
  });
  const teacherQuery = useGetTeacherAttendancesQuery(undefined, {
    skip: scope !== "teacher",
  });
  const { data, isLoading, isFetching, isError, error, refetch } =
    scope === "teacher" ? teacherQuery : adminQuery;
  const queryError = error as FetchBaseQueryError | undefined;
  const errorData = queryError?.data as { message?: unknown } | undefined;
  const errorMessage =
    typeof errorData?.message === "string" ? errorData.message : undefined;

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
    errorStatus: queryError?.status,
    errorMessage,
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
