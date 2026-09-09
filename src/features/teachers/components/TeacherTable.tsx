// features/teachers/components/TeacherTable.tsx

"use client";

import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ROUTES } from "@/constants/routes";
import { useTeacherActions } from "../hooks/useTeacherActions";
import type { Teacher } from "../types";

interface TeacherTableProps {
  teachers: Teacher[];
}

export function TeacherTable({ teachers }: TeacherTableProps) {
  const router = useRouter();
  const { delete: deleteTeacher, isDeleting } = useTeacherActions();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    teacherId?: number;
    teacherName?: string;
  }>({ isOpen: false });

  const handleDeleteClick = (teacherId: number, teacherName: string) => {
    setDeleteConfirm({ isOpen: true, teacherId, teacherName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.teacherId) return;
    try {
      await deleteTeacher(deleteConfirm.teacherId, { redirectToList: false });
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
                Subjects
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
            {teachers.map((teacher) => {
              const teacherName = teacher.teacherName ?? "Unnamed teacher";

              return (
                <tr
                  key={teacher.teacherId}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                    {teacherName}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-zinc-600">
                    {teacher.subjects.length} subject
                    {teacher.subjects.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-zinc-600">
                    {teacher.classes.length} class
                    {teacher.classes.length !== 1 ? "es" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            ROUTES.TEACHERS.DETAILS(teacher.teacherId)
                          )
                        }
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          router.push(
                            ROUTES.TEACHERS.DETAILS(teacher.teacherId) +
                              "?edit"
                          )
                        }
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                        title="Edit teacher"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(teacher.teacherId, teacherName)
                        }
                        disabled={isDeleting}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Delete teacher"
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

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Teacher?"
        description={`Are you sure you want to delete "${deleteConfirm.teacherName}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
