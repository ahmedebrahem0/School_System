"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ROUTES } from "@/constants/routes";
import { useGradeActions } from "../hooks/useGradeActions";
import type { Grade } from "../types";
import { GradeBadge } from "./GradeBadge";

interface GradeTableProps {
  grades: Grade[];
  readOnly?: boolean;
}

export function GradeTable({ grades, readOnly = false }: GradeTableProps) {
  const router = useRouter();
  const { delete: deleteGrade, isDeleting } = useGradeActions();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    grade?: Grade;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.grade) return;
    await deleteGrade(deleteConfirm.grade.id, {
      redirectToList: false,
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
                Student
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Status
              </th>
              {!readOnly && (
                <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr
                key={grade.id}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4">
                  <div className="text-[14px] font-medium text-zinc-900">
                    {grade.studentName}
                  </div>
                  <div className="text-[12px] text-zinc-500">
                    ID {grade.studentId}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[14px] text-zinc-700">
                    {grade.subjectName}
                  </div>
                  <div className="text-[12px] text-zinc-500">
                    Subject {grade.subjectId}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <GradeBadge grade={grade.grade} />
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {grade.grade >= 50 ? "Passing" : "Needs support"}
                </td>
                {!readOnly && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(ROUTES.GRADES.DETAILS(grade.id))}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="View grade"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`${ROUTES.GRADES.DETAILS(grade.id)}?edit`)
                        }
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                        title="Edit grade"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ isOpen: true, grade })}
                        disabled={isDeleting}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Delete grade"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
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
        title="Delete Grade?"
        description={`Delete ${deleteConfirm.grade?.studentName}'s ${deleteConfirm.grade?.subjectName} grade? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
