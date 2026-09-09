"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useTeacherSubjects } from "../hooks/useTeacherSubjects";
import type { TeacherSubject } from "../types";

interface TeacherSubjectTableProps {
  teacherId: number;
  subjectsMap?: Record<number, string>;
}

export function TeacherSubjectTable({ teacherId, subjectsMap = {} }: TeacherSubjectTableProps) {
  const { subjects, isDeleting, remove } = useTeacherSubjects(teacherId);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    teacherSubject?: TeacherSubject;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.teacherSubject) return;

    await remove(deleteConfirm.teacherSubject.teacherId, deleteConfirm.teacherSubject.subjectId, {
      onSuccess: () => setDeleteConfirm({ isOpen: false }),
    });
  };

  if (subjects.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-zinc-500">
        No subjects assigned to this teacher yet.
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
                Subject
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((ts) => (
              <tr
                key={ts.subjectId}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                  {subjectsMap[ts.subjectId] || `Subject ${ts.subjectId}`}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ isOpen: true, teacherSubject: ts })}
                    disabled={isDeleting}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Unassign subject"
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
        title="Unassign Subject?"
        description="Remove this subject from the teacher? This action cannot be undone."
        confirmLabel="Unassign"
      />
    </>
  );
}
