import { useMemo, useState } from "react";
import { paginate, type PaginatedResult } from "@/types/api.types";
import { useGetClassroomsQuery } from "../api";
import type { Classroom } from "../types";

interface UseClassroomsOptions {
  limit?: number;
}

interface UseClassroomsReturn {
  result: PaginatedResult<Classroom>;
  classrooms: Classroom[];
  allClassrooms: Classroom[];
  filteredClassrooms: Classroom[];
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

export const useClassrooms = (
  options: UseClassroomsOptions = {}
): UseClassroomsReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetClassroomsQuery();

  const filteredClassrooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (data ?? []).filter((classroom) => {
      const matchesSearch = query
        ? classroom.roomNumber.toLowerCase().includes(query) ||
          classroom.capacity.toString().includes(query)
        : true;

      return matchesSearch;
    });
  }, [data, searchQuery]);

  const result = useMemo(
    () => paginate(filteredClassrooms, { page, limit }),
    [filteredClassrooms, page, limit]
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
    classrooms: result.data,
    allClassrooms: data ?? [],
    filteredClassrooms,
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
