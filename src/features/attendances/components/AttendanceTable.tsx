"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ROUTES } from "@/constants/routes";
import { formatDateShort } from "@/lib/utils/formatters";
import { useAttendanceActions } from "../hooks/useAttendanceActions";
import type { Attendance } from "../types";
import { AttendanceBadge } from "./AttendanceBadge";

interface AttendanceTableProps {
  attendances: Attendance[];
  readOnly?: boolean;
}

export function AttendanceTable({
  attendances,
  readOnly = false,
}: AttendanceTableProps) {
  const router = useRouter();
  const { delete: deleteAttendance, isDeleting } = useAttendanceActions();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    attendance?: Attendance;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.attendance) return;
    await deleteAttendance(deleteConfirm.attendance.attendanceId, {
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
                Date
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
            {attendances.map((attendance) => (
              <tr
                key={attendance.attendanceId}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4">
                  <div className="text-[14px] font-medium text-zinc-900">
                    {attendance.studentName ?? "Unknown student"}
                  </div>
                  <div className="text-[12px] text-zinc-500">
                    ID {attendance.studentId}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-[13px] text-zinc-700">
                    {formatDateShort(attendance.date)}
                  </div>
                  <div className="text-[12px] text-zinc-500">
                    {attendance.date?.slice(0, 10) ?? "No date recorded"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AttendanceBadge status={attendance.status} />
                </td>
                {!readOnly && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            ROUTES.ATTENDANCES.DETAILS(attendance.attendanceId)
                          )
                        }
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="View attendance"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `${ROUTES.ATTENDANCES.DETAILS(
                              attendance.attendanceId
                            )}?edit`
                          )
                        }
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                        title="Edit attendance"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({ isOpen: true, attendance })
                        }
                        disabled={isDeleting}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Delete attendance"
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
        title="Delete Attendance?"
        description={`Delete ${
          deleteConfirm.attendance?.studentName ?? "this student"
        }'s attendance record? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
