import { useMemo, useState } from "react";
import { ALL_ROLES, type Role } from "@/constants/roles";
import { paginate, type PaginatedResult } from "@/types/api.types";
import { useGetAdminUsersQuery } from "../api";
import type { AdminRoleSummary, AdminUser } from "../types";

interface UseAdminUsersOptions {
  limit?: number;
}

interface UseAdminUsersReturn {
  result: PaginatedResult<AdminUser>;
  users: AdminUser[];
  allUsers: AdminUser[];
  filteredUsers: AdminUser[];
  roleSummaries: AdminRoleSummary[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  pendingFilter: string;
  setPendingFilter: (filter: string) => void;
  page: number;
  setPage: (page: number) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  refetch: () => void;
}

const roleMatches = (roles: Role[], roleFilter: string) =>
  roleFilter === "all" ? true : roles.includes(roleFilter as Role);

const pendingMatches = (roles: Role[], pendingFilter: string) => {
  if (pendingFilter === "pending") return roles.length === 0;
  if (pendingFilter === "assigned") return roles.length > 0;
  return true;
};

export const getRoleSummaries = (users: AdminUser[]): AdminRoleSummary[] =>
  ALL_ROLES.map((role) => ({
    role,
    label: role,
    description:
      role === "Admin"
        ? "Full system access"
        : role === "Teacher"
        ? "Class, grade, and attendance tools"
        : "Student self-service access",
    count: users.filter((user) => (user.roles ?? []).includes(role)).length,
  }));

export const useAdminUsers = (
  options: UseAdminUsersOptions = {}
): UseAdminUsersReturn => {
  const { limit = 10 } = options;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");
  const [roleFilter, setRoleFilterState] = useState("all");
  const [pendingFilter, setPendingFilterState] = useState("all");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAdminUsersQuery();

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (data ?? []).filter((user) => {
      const roles = user.roles ?? [];
      const matchesSearch = query
        ? (user.fullName ?? "").toLowerCase().includes(query) ||
          (user.userName ?? "").toLowerCase().includes(query) ||
          (user.email ?? "").toLowerCase().includes(query)
        : true;

      return (
        matchesSearch &&
        roleMatches(roles, roleFilter) &&
        pendingMatches(roles, pendingFilter)
      );
    });
  }, [data, searchQuery, roleFilter, pendingFilter]);

  const result = useMemo(
    () => paginate(filteredUsers, { page, limit }),
    [filteredUsers, page, limit]
  );

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQueryState("");
    setRoleFilterState("all");
    setPendingFilterState("all");
    setPage(1);
  };

  return {
    result,
    users: result.data,
    allUsers: data ?? [],
    filteredUsers,
    roleSummaries: getRoleSummaries(data ?? []),
    isLoading,
    isFetching,
    isError,
    searchQuery,
    setSearchQuery: resetPage(setSearchQueryState),
    roleFilter,
    setRoleFilter: resetPage(setRoleFilterState),
    pendingFilter,
    setPendingFilter: resetPage(setPendingFilterState),
    page,
    setPage,
    hasActiveFilters:
      Boolean(searchQuery.trim()) ||
      roleFilter !== "all" ||
      pendingFilter !== "all",
    clearFilters,
    refetch,
  };
};
