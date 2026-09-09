import { useGetUsersWithoutRoleQuery } from "../api";

export const useUsersWithoutRole = () => {
  const query = useGetUsersWithoutRoleQuery();

  return {
    ...query,
    users: query.data ?? [],
  };
};
