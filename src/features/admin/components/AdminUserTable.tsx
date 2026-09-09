"use client";

import { ShieldMinus, ShieldPlus, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Role } from "@/constants/roles";
import { useAssignRole } from "../hooks/useAssignRole";
import type { AdminUser } from "../types";
import { AssignRoleModal } from "./AssignRoleModal";
import { RoleBadge } from "./RoleBadge";

interface AdminUserTableProps {
  users: AdminUser[];
}

export function AdminUserTable({ users }: AdminUserTableProps) {
  const { remove, deleteUser, isRemoving, isDeleting } = useAssignRole();
  const [assignUser, setAssignUser] = useState<AdminUser>();
  const [removeConfirm, setRemoveConfirm] = useState<{
    isOpen: boolean;
    user?: AdminUser;
    role?: Role;
  }>({ isOpen: false });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    user?: AdminUser;
  }>({ isOpen: false });

  const handleConfirmRemove = async () => {
    if (!removeConfirm.user || !removeConfirm.role) return;

    await remove(
      {
        userId: removeConfirm.user.id,
        role: removeConfirm.role,
      },
      {
        onSuccess: () => setRemoveConfirm({ isOpen: false }),
      }
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.user) return;

    await deleteUser(deleteConfirm.user.id, {
      onSuccess: () => setDeleteConfirm({ isOpen: false }),
    });
  };

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
                Gender
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const displayName = user.fullName || user.userName;
              const roles = user.roles ?? [];

              return (
                <tr
                  key={user.id}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-medium text-zinc-900">
                      {displayName}
                    </div>
                    <div className="max-w-[220px] truncate text-[12px] text-zinc-500">
                      {user.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] text-zinc-700">
                      {user.email}
                    </div>
                    <div className="text-[12px] text-zinc-500">
                      @{user.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-zinc-600">
                    {user.gender || "Not set"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {roles.length === 0 ? (
                        <RoleBadge />
                      ) : (
                        roles.map((role) => (
                          <span key={role} className="inline-flex items-center gap-1">
                            <RoleBadge role={role} />
                            <button
                              type="button"
                              onClick={() =>
                                setRemoveConfirm({ isOpen: true, user, role })
                              }
                              disabled={isRemoving}
                              className="rounded-full p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title={`Remove ${role}`}
                            >
                              <ShieldMinus className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => setAssignUser(user)}
                        title="Assign role"
                      >
                        <ShieldPlus className="h-4 w-4" />
                      </Button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ isOpen: true, user })}
                        disabled={isDeleting}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AssignRoleModal
        user={assignUser}
        open={Boolean(assignUser)}
        onOpenChange={(open) => !open && setAssignUser(undefined)}
      />

      <ConfirmDialog
        isOpen={removeConfirm.isOpen}
        onClose={() => setRemoveConfirm({ isOpen: false })}
        onConfirm={handleConfirmRemove}
        isLoading={isRemoving}
        title="Remove Role?"
        description={`Remove ${removeConfirm.role} from ${
          removeConfirm.user?.fullName || removeConfirm.user?.userName || "this user"
        }?`}
        confirmLabel="Remove"
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete User?"
        description={`Delete ${
          deleteConfirm.user?.fullName || deleteConfirm.user?.userName || "this user"
        }? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
