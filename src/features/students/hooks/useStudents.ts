// features/students/hooks/useStudents.ts

// Students list hook with search and pagination
// Handles fetching all students and client-side search + pagination
// No API calls for search/pagination — all client-side for performance

import { useState, useMemo } from "react";
import { useGetStudentsQuery } from "../api";
import { paginate } from "@/types/api.types";
import type { Student } from "../types";
import type { PaginatedResult } from "@/types/api.types";

// ─────────────────────────────────────────────────────
// HOOK OPTIONS
// ─────────────────────────────────────────────────────
interface UseStudentsOptions {
  // Items per page — default 10
  limit?: number;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN TYPE
// Everything the component needs
// ─────────────────────────────────────────────────────
interface UseStudentsReturn {
  // Paginated data (filtered + paginated)
  result: PaginatedResult<Student>;

  // Loading states
  isLoading: boolean;  // First load (show skeleton)
  isFetching: boolean; // Background refetch (show subtle indicator)
  isError: boolean;    // Error state

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

  // ─────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  // ─────────────────────────────────────────────────
  // FETCH ALL STUDENTS
  // RTK Query handles caching automatically
  // ─────────────────────────────────────────────────
  const { data, isLoading, isFetching, isError, refetch } =
    useGetStudentsQuery();

  // ─────────────────────────────────────────────────
  // CLIENT-SIDE SEARCH
  // Filter by student name (case-insensitive)
  // useMemo prevents recalculation on every render
  //
  // Only recalculates when:
  //   - data changes (new fetch from API)
  //   - searchQuery changes (user types)
  // ─────────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    const students = data ?? [];

    // If search is empty, return all students
    if (!searchQuery.trim()) return students;

    // Filter by name (case-insensitive)
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // ─────────────────────────────────────────────────
  // HANDLE SEARCH CHANGE
  // When user types in search:
  //   1. Update search query
  //   2. Reset pagination to page 1
  //   (prevents being on page 5 with only 1 result)
  // ─────────────────────────────────────────────────
  const handleSearchChange = (query: string) => {
    setSearchQueryState(query);
    setPage(1); // Reset to first page
  };

  // ─────────────────────────────────────────────────
  // CLIENT-SIDE PAGINATION
  // Takes filtered students and returns one page
  // useMemo prevents recalculation unless:
  //   - filteredStudents changes (search changed)
  //   - page changes (user clicked pagination)
  //   - limit changes (usually doesn't)
  // ─────────────────────────────────────────────────
  const result = useMemo(
    () => paginate(filteredStudents, { page, limit }),
    [filteredStudents, page, limit]
  );

  return {
    // Paginated data
    result,

    // Loading states
    isLoading,  // Show skeleton on first load
    isFetching, // Show subtle indicator during refetch
    isError,    // Show error message

    // Search
    searchQuery,
    setSearchQuery: handleSearchChange,

    // Pagination
    page,
    setPage,

    // Refetch
    refetch,
  };
};
