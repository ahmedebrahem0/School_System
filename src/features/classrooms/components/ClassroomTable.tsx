"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useClassroomActions } from "../hooks/useClassroomActions";
import type { Classroom } from "../types";
import { ClassroomForm } from "./ClassroomForm";

interface ClassroomTableProps {
  classrooms: Classroom[];
}

export function ClassroomTable({ classrooms }: ClassroomTableProps) {
  const { update, remove, isUpdating, isDeleting } = useClassroomActions();
  const [editClassroom, setEditClassroom] = useState<Classroom>();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    classroom?: Classroom;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.classroom) return;

    await remove(deleteConfirm.classroom.id, {
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
                Room Number
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr
                key={classroom.id}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                  {classroom.roomNumber}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {classroom.capacity}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      onClick={() => setEditClassroom(classroom)}
                      title="Edit classroom"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ isOpen: true, classroom })}
                      disabled={isDeleting}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="Delete classroom"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ClassroomForm
        mode="update"
        classroom={editClassroom}
        open={Boolean(editClassroom)}
        onOpenChange={(open) => !open && setEditClassroom(undefined)}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Classroom?"
        description={`Delete room ${deleteConfirm.classroom?.roomNumber}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
