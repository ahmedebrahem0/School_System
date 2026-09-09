// features/classes/hooks/useClasses.ts

import { useState, useMemo } from "react";
import { useGetClassesQuery } from "../api";
import { paginate } from "@/types/api.types";
import type { Classes } from "../types";
import type { PaginatedResult } from "@/types/api.types";

export const useClasses = (): {
  result: PaginatedResult<Classes>;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  page: number;
  setPage: (page: number) => void;
  refetch: () => void;
} => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetClassesQuery();

  const filteredClasses = useMemo(() => {
    const classes = data ?? [];
    if (!searchQuery.trim()) return classes;
    return classes.filter((cls) =>
      cls.className.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQueryState(query);
    setPage(1);
  };

  const result = useMemo(
    () => paginate(filteredClasses, { page, limit: 10 }),
    [filteredClasses, page]
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