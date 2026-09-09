import { useGetSubjectQuery } from "../api";
import type { SubjectDetails } from "../types";

export const useSubject = (
  id: number
): {
  subject: SubjectDetails | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetSubjectQuery(id);

  return {
    subject: data,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};
