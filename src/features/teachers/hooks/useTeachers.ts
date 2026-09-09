import { useMemo, useState } from "react";
import { useGetTeachersQuery } from "../api";
import { paginate, type PaginatedResult } from "@/types/api.types";
import type { Teacher } from "../types";

interface UseTeachersOptions {
  limit?: number;
}

interface UseTeachersReturn {
  result: PaginatedResult<Teacher>;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  page: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export const useTeachers = (
  options: UseTeachersOptions = {}
): UseTeachersReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTeachersQuery();

  const filteredTeachers = useMemo(() => {
    const teachers = data ?? [];

    if (!searchQuery.trim()) return teachers;

    return teachers.filter((teacher) =>
      (teacher.teacherName ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    setPage(1);
  };

  const result = useMemo(
    () => paginate(filteredTeachers, { page, limit }),
    [filteredTeachers, page, limit]
  );

  return {
    result,
    isLoading,
    isFetching,
    isError,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    refetch,
  };
};
