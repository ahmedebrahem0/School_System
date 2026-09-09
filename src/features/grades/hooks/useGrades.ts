import { useMemo, useState } from "react";
import { paginate, type PaginatedResult } from "@/types/api.types";
import { useGetGradesQuery } from "../api";
import type { Grade } from "../types";

interface UseGradesOptions {
  limit?: number;
}

interface UseGradesReturn {
  result: PaginatedResult<Grade>;
  grades: Grade[];
  allGrades: Grade[];
  filteredGrades: Grade[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  subjectFilter: string;
  setSubjectFilter: (subjectName: string) => void;
  studentFilter: string;
  setStudentFilter: (studentName: string) => void;
  page: number;
  setPage: (page: number) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  refetch: () => void;
}

export const useGrades = (
  options: UseGradesOptions = {}
): UseGradesReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");
  const [subjectFilter, setSubjectFilterState] = useState("all");
  const [studentFilter, setStudentFilterState] = useState("all");

  const { data, isLoading, isFetching, isError, refetch } = useGetGradesQuery();

  const filteredGrades = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (data ?? []).filter((grade) => {
      const matchesSearch = query
        ? grade.studentName.toLowerCase().includes(query) ||
          grade.subjectName.toLowerCase().includes(query) ||
          String(grade.grade).includes(query)
        : true;
      const matchesSubject =
        subjectFilter === "all" ? true : grade.subjectName === subjectFilter;
      const matchesStudent =
        studentFilter === "all" ? true : grade.studentName === studentFilter;

      return matchesSearch && matchesSubject && matchesStudent;
    });
  }, [data, searchQuery, subjectFilter, studentFilter]);

  const result = useMemo(
    () => paginate(filteredGrades, { page, limit }),
    [filteredGrades, page, limit]
  );

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQueryState("");
    setSubjectFilterState("all");
    setStudentFilterState("all");
    setPage(1);
  };

  return {
    result,
    grades: result.data,
    allGrades: data ?? [],
    filteredGrades,
    isLoading,
    isFetching,
    isError,
    searchQuery,
    setSearchQuery: resetPage(setSearchQueryState),
    subjectFilter,
    setSubjectFilter: resetPage(setSubjectFilterState),
    studentFilter,
    setStudentFilter: resetPage(setStudentFilterState),
    page,
    setPage,
    hasActiveFilters:
      Boolean(searchQuery.trim()) ||
      subjectFilter !== "all" ||
      studentFilter !== "all",
    clearFilters,
    refetch,
  };
};
