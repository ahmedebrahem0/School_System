// features/classes/hooks/useClass.ts

import { useGetClassQuery } from "../api";
import type { ClassDetails } from "../types";

export const useClass = (id: number): {
  class: ClassDetails | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetClassQuery(id);

  return {
    class: data,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};