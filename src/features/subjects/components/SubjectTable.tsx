// features/subjects/components/SubjectTable.tsx

"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ROUTES } from "@/constants/routes";
import { useSubjectActions } from "../hooks/useSubjectActions";
import type { Subject } from "../types";

interface SubjectTableProps {
  subjects: Subject[];
}

export function SubjectTable({ subjects }: SubjectTableProps) {
  const router = useRouter();
  const { delete: deleteSubject, isDeleting } = useSubjectActions();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    subjectId?: number;
    subjectName?: string;
  }>({ isOpen: false });

  const handleDeleteClick = (subjectId: number, subjectName: string) => {
    setDeleteConfirm({ isOpen: true, subjectId, subjectName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.subjectId) return;
    try {
      await deleteSubject(deleteConfirm.subjectId, { redirectToList: false });
      setDeleteConfirm({ isOpen: false });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Teachers
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Classes
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
                className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                  {subject.subjectName}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {subject.teachers.length} teacher{subject.teachers.length !== 1 ? "s" : ""}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {subject.classes.length} class{subject.classes.length !== 1 ? "es" : ""}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(ROUTES.SUBJECTS.DETAIL(subject.subjectId))
                      }
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          ROUTES.SUBJECTS.DETAIL(subject.subjectId) + "?edit"
                        )
                      }
                      className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"
                      title="Edit subject"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteClick(subject.subjectId, subject.subjectName)
                      }
                      disabled={isDeleting}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="Delete subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
        title="Delete Subject?"
        description={`Are you sure you want to delete "${deleteConfirm.subjectName}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
