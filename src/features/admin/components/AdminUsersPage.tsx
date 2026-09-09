"use client";

import { FilterX, Search, ShieldPlus } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_ROLES, ROLE_META } from "@/constants/roles";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useUsersWithoutRole } from "../hooks/useUsersWithoutRole";
import type { AdminUser } from "../types";
import { AdminUserTable } from "./AdminUserTable";
import { AdminUserTableSkeleton } from "./AdminUserTable.skeleton";
import { AdminUsersStats } from "./AdminUsersStats";
import { AssignRoleModal } from "./AssignRoleModal";
import { UsersWithoutRoleTable } from "./UsersWithoutRoleTable";

export function AdminUsersPage() {
  const [quickAssignUser, setQuickAssignUser] = useState<AdminUser>();
  const {
    result,
    users,
    allUsers,
    filteredUsers,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    pendingFilter,
    setPendingFilter,
    hasActiveFilters,
    clearFilters,
    setPage,
    refetch,
  } = useAdminUsers();
  const {
    users: usersWithoutRole,
    isLoading: isLoadingPending,
    isError: isPendingError,
    refetch: refetchPending,
  } = useUsersWithoutRole();

  const pendingCount = usersWithoutRole.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage account access, role assignment, and pending users"
        count={filteredUsers.length}
        actions={
          usersWithoutRole.length > 0 && (
            <Button onClick={() => setQuickAssignUser(usersWithoutRole[0])}>
              <ShieldPlus className="h-4 w-4" />
              Assign Pending
            </Button>
          )
        }
      />

      <AdminUsersStats users={allUsers} pendingCount={pendingCount} />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pending role assignments</CardTitle>
            <CardDescription>
              Registered accounts that still need an Admin, Teacher, or Student
              role.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPending ? (
            <AdminUserTableSkeleton />
          ) : isPendingError ? (
            <ErrorMessage
              title="Pending users could not be loaded"
              description="The users-without-role endpoint is unavailable right now."
              onRetry={refetchPending}
            />
          ) : (
            <UsersWithoutRoleTable users={usersWithoutRole} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="items-start gap-4 md:flex-row">
          <div>
            <CardTitle>All users</CardTitle>
            <CardDescription>
              Search by name, username, or email and filter by role state.
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search users..."
              leftIcon={<Search size={15} />}
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ALL_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_META[role].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={pendingFilter} onValueChange={setPendingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <AdminUserTableSkeleton />
          ) : isError ? (
            <ErrorMessage
              title="Users could not be loaded"
              description="Admin user management is unavailable right now."
              onRetry={refetch}
            />
          ) : users.length === 0 ? (
            <EmptyState
              title="No users found"
              description="Try changing filters or wait for new registered accounts."
            />
          ) : (
            <>
              <AdminUserTable users={users} />
              {result.totalPages > 1 && (
                <Pagination result={result} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AssignRoleModal
        user={quickAssignUser}
        open={Boolean(quickAssignUser)}
        onOpenChange={(open) => !open && setQuickAssignUser(undefined)}
      />
    </div>
  );
}
