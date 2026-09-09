"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useTimetableActions } from "../hooks/useTimetableActions";
import type { Timetable } from "../types";
import { TimetableForm } from "./TimetableForm";

interface TimetableTableProps {
  timetables: Timetable[];
  classesMap?: Record<number, string>;
  subjectsMap?: Record<number, string>;
  classroomsMap?: Record<number, string>;
  timeSlotsMap?: Record<number, string>;
}

export function TimetableTable({
  timetables,
  classesMap = {},
  subjectsMap = {},
  classroomsMap = {},
  timeSlotsMap = {},
}: TimetableTableProps) {
  const { update, remove, isUpdating, isDeleting } = useTimetableActions();
  const [editTimetable, setEditTimetable] = useState<Timetable>();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    timetable?: Timetable;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.timetable) return;

    await remove(deleteConfirm.timetable.id, {
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
                Class
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Day
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Time
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Classroom
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((timetable) => (
              <tr
                key={timetable.id}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                  {classesMap[timetable.classId] || `Class ${timetable.classId}`}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {subjectsMap[timetable.subjectId] || `Subject ${timetable.subjectId}`}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {timetable.dayOfWeek}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {timeSlotsMap[timetable.timeSlotId] || `Slot ${timetable.timeSlotId}`}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {classroomsMap[timetable.classroomId] || `Room ${timetable.classroomId}`}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      onClick={() => setEditTimetable(timetable)}
                      title="Edit timetable"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ isOpen: true, timetable })}
                      disabled={isDeleting}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="Delete timetable"
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

      <TimetableForm
        mode="update"
        timetable={editTimetable}
        open={Boolean(editTimetable)}
        onOpenChange={(open) => !open && setEditTimetable(undefined)}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Timetable Entry?"
        description="Delete this timetable entry? This action cannot be undone."
        confirmLabel="Delete"
      />
    </>
  );
}
