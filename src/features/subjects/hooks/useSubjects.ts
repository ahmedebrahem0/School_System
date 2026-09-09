import { useMemo, useState } from "react";
import { useGetSubjectsQuery } from "../api";
import { paginate, type PaginatedResult } from "@/types/api.types";
import type { Subject } from "../types";

interface UseSubjectsOptions {
  limit?: number;
}

interface UseSubjectsReturn {
  result: PaginatedResult<Subject>;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  page: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export const useSubjects = (
  options: UseSubjectsOptions = {}
): UseSubjectsReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetSubjectsQuery();

  const filteredSubjects = useMemo(() => {
    const subjects = data ?? [];

    if (!searchQuery.trim()) return subjects;

    return subjects.filter((subject) =>
      subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    setPage(1);
  };

  const result = useMemo(
    () => paginate(filteredSubjects, { page, limit }),
    [filteredSubjects, page, limit]
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
