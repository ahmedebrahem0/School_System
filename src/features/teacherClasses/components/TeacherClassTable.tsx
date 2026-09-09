"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useTeacherClasses } from "../hooks/useTeacherClasses";
import type { TeacherClass } from "../types";

interface TeacherClassTableProps {
  teacherId: number;
  classesMap?: Record<number, string>;
}

export function TeacherClassTable({ teacherId, classesMap = {} }: TeacherClassTableProps) {
  const { classes, isDeleting, remove } = useTeacherClasses(teacherId);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    teacherClass?: TeacherClass;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.teacherClass) return;

    await remove(deleteConfirm.teacherClass.teacherId, deleteConfirm.teacherClass.classId, {
      onSuccess: () => setDeleteConfirm({ isOpen: false }),
    });
  };

  if (classes.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-zinc-500">
        No classes assigned to this teacher yet.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Class
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {classes.map((tc) => (
              <tr
                key={tc.classId}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                  {classesMap[tc.classId] || `Class ${tc.classId}`}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ isOpen: true, teacherClass: tc })}
                    disabled={isDeleting}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Unassign class"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Unassign Class?"
        description="Remove this class from the teacher? This action cannot be undone."
        confirmLabel="Unassign"
      />
    </>
  );
}
