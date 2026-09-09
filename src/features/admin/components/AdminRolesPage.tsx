"use client";

import { Shield, Users } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROLE_META } from "@/constants/roles";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { AdminUsersStats } from "./AdminUsersStats";
import { AdminUserTableSkeleton } from "./AdminUserTable.skeleton";

export function AdminRolesPage() {
  const { allUsers, roleSummaries, isLoading, isError, refetch } =
    useAdminUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        subtitle="Review role distribution and access coverage"
        count={roleSummaries.length}
      />

      <AdminUsersStats users={allUsers} />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Role coverage</CardTitle>
            <CardDescription>
              Role counts are calculated from the live admin users list.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AdminUserTableSkeleton />
          ) : isError ? (
            <ErrorMessage
              title="Roles could not be loaded"
              description="User role counts are unavailable right now."
              onRetry={refetch}
            />
          ) : roleSummaries.length === 0 ? (
            <EmptyState
              icon={<Shield className="h-8 w-8 text-zinc-400" />}
              title="No roles configured"
              description="Configured roles will appear here after constants are loaded."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                      Users
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roleSummaries.map((summary) => (
                    <tr
                      key={summary.role}
                      className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                    >
                      <td className="px-6 py-4">
                        <Badge
                          className={ROLE_META[summary.role].color}
                          variant="outline"
                          dot
                        >
                          {summary.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-zinc-600">
                        {ROLE_META[summary.role].description}
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 text-[14px] font-medium text-zinc-900">
                          <Users className="h-4 w-4 text-zinc-400" />
                          {summary.count}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
