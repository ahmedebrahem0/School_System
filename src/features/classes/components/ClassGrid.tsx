// features/classes/components/ClassGrid.tsx

"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ROUTES } from "@/constants/routes";
import { useClassActions } from "../hooks/useClassActions";
import type { Class } from "../types";

interface ClassGridProps {
  classes: Class[];
}

export function ClassGrid({ classes }: ClassGridProps) {
  const router = useRouter();
  const { delete: deleteClass, isDeleting } = useClassActions();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    classId?: number;
    className?: string;
  }>({ isOpen: false });

  const handleDeleteClick = (classId: number, className: string) => {
    setDeleteConfirm({ isOpen: true, classId, className });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.classId) return;
    try {
      await deleteClass(deleteConfirm.classId, { redirectToList: false });
      setDeleteConfirm({ isOpen: false });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.classId}
            className="bg-white rounded-lg border border-zinc-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {cls.className}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  ID: {cls.classId}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-zinc-600">
              <p>
                <span className="font-medium">Students:</span> {cls.students.length}
              </p>
              <p>
                <span className="font-medium">Teachers:</span> {cls.teachers.length}
              </p>
              <p>
                <span className="font-medium">Subjects:</span> {cls.subjects.length}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-zinc-200">
              <button
                onClick={() => router.push(ROUTES.CLASSES.DETAIL(cls.classId))}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 flex-1"
                title="View details"
              >
                <Eye className="w-4 h-4 inline mr-2" />
                View
              </button>
              <button
                onClick={() =>
                  router.push(
                    ROUTES.CLASSES.DETAIL(cls.classId) + "?edit"
                  )
                }
                className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 flex-1"
                title="Edit class"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(cls.classId, cls.className)}
                disabled={isDeleting}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 flex-1 disabled:opacity-50"
                title="Delete class"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Class?"
        description={`Are you sure you want to delete "${deleteConfirm.className}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}