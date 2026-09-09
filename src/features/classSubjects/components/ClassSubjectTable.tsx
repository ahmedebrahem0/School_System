"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useClassSubjects } from "../hooks/useClassSubjects";
import type { ClassSubject } from "../types";

interface ClassSubjectTableProps {
  classId: number;
  subjectsMap?: Record<number, string>;
}

export function ClassSubjectTable({ classId, subjectsMap = {} }: ClassSubjectTableProps) {
  const { subjects, isDeleting, remove } = useClassSubjects(classId);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    subject?: ClassSubject;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.subject) return;

    await remove(deleteConfirm.subject.classId, deleteConfirm.subject.subjectId, {
      onSuccess: () => setDeleteConfirm({ isOpen: false }),
    });
  };

  if (subjects.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-zinc-500">
        No subjects linked to this class yet.
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
            {subjects.map((subject) => (
              <tr
                key={subject.subjectId}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                  {subjectsMap[subject.subjectId] || `Subject ${subject.subjectId}`}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ isOpen: true, subject })}
                    disabled={isDeleting}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Unlink subject"
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
        title="Unlink Subject?"
        description="Remove this subject from the class? This action cannot be undone."
        confirmLabel="Unlink"
      />
    </>
  );
}
