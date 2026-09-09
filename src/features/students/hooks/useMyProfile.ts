import { useGetMyProfileQuery } from "../api";

export const useMyProfile = () => {
  const { data: student, isLoading, isFetching, isError, refetch } =
    useGetMyProfileQuery();

  return {
    student,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};
