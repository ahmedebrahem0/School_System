import { useGetTeacherQuery } from "../api";
import type { TeacherDetails } from "../types";

export const useTeacher = (
  id: number
): {
  teacher: TeacherDetails | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetTeacherQuery(id);

  return {
    teacher: data,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};
