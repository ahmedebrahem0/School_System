// features/students/hooks/useStudents.ts

// Students list hook
// Handles fetching, searching, filtering, and pagination
// All pagination and search are client-side

import { useState, useMemo } from "react";
import { useGetStudentsQuery } from "../api";
import { paginate } from "@/types/api.types";
import type { Student } from "../types";
import type { PaginatedResult } from "@/types/api.types";

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────
interface UseStudentsOptions {
  limit?: number; // Items per page — default 10
}

// ─────────────────────────────────────────────────────
// HOOK RETURN TYPE
// ─────────────────────────────────────────────────────
interface UseStudentsReturn {
  // Paginated data
  result: PaginatedResult<Student>;

  // States
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  page: number;
  setPage: (page: number) => void;

  // Refetch
  refetch: () => void;
}

// ─────────────────────────────────────────────────────
// USE STUDENTS HOOK
// ─────────────────────────────────────────────────────
export const useStudents = (
  options: UseStudentsOptions = {}
): UseStudentsReturn => {
  const { limit = 10 } = options;

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetStudentsQuery();

  // ─────────────────────────────────────────────────
  // FILTER BY SEARCH QUERY
  // Client-side search — filters by student name
  // useMemo prevents recalculation on every render
  // ─────────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    const students = data ?? [];

    if (!searchQuery.trim()) return students;

    return students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // ─────────────────────────────────────────────────
  // RESET PAGE WHEN SEARCH CHANGES
  // Prevents being on page 5 with only 1 result
  // ─────────────────────────────────────────────────
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  // ─────────────────────────────────────────────────
  // PAGINATE FILTERED RESULTS
  // Client-side pagination using paginate() from api.types
  // ─────────────────────────────────────────────────
  const result = useMemo(
    () => paginate(filteredStudents, { page, limit }),
    [filteredStudents, page, limit]
  );

  return {
    result,
    isLoading,
    isFetching,
    isError,
    searchQuery,
    setSearchQuery: handleSearchChange,
    page,
    setPage,
    refetch,
  };
};