"use client";

import { ShieldPlus } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "../types";
import { AssignRoleModal } from "./AssignRoleModal";

interface UsersWithoutRoleTableProps {
  users: AdminUser[];
}

export function UsersWithoutRoleTable({ users }: UsersWithoutRoleTableProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUser>();

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<ShieldPlus className="h-8 w-8 text-zinc-400" />}
        title="No pending users"
        description="New registered accounts without roles will appear here."
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                User
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4">
                  <div className="text-[14px] font-medium text-zinc-900">
                    {user.fullName || user.userName}
                  </div>
                  <div className="text-[12px] text-zinc-500">
                    @{user.userName}
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <Button size="sm" onClick={() => setSelectedUser(user)}>
                    <ShieldPlus className="h-4 w-4" />
                    Assign
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignRoleModal
        user={selectedUser}
        open={Boolean(selectedUser)}
        onOpenChange={(open) => !open && setSelectedUser(undefined)}
      />
    </>
  );
}
