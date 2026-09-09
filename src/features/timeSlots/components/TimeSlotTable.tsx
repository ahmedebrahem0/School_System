"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useTimeSlotActions } from "../hooks/useTimeSlotActions";
import type { TimeSlot } from "../types";
import { TimeSlotForm } from "./TimeSlotForm";

interface TimeSlotTableProps {
  timeSlots: TimeSlot[];
}

export function TimeSlotTable({ timeSlots }: TimeSlotTableProps) {
  const { update, remove, isUpdating, isDeleting } = useTimeSlotActions();
  const [editTimeSlot, setEditTimeSlot] = useState<TimeSlot>();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    timeSlot?: TimeSlot;
  }>({ isOpen: false });

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.timeSlot) return;

    await remove(deleteConfirm.timeSlot.id, {
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
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-[13px] font-semibold text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <tr
                key={timeSlot.id}
                className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-zinc-900">
                  {timeSlot.startTime}
                </td>
                <td className="px-6 py-4 text-[14px] text-zinc-600">
                  {timeSlot.endTime}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      onClick={() => setEditTimeSlot(timeSlot)}
                      title="Edit time slot"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ isOpen: true, timeSlot })}
                      disabled={isDeleting}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="Delete time slot"
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

      <TimeSlotForm
        mode="update"
        timeSlot={editTimeSlot}
        open={Boolean(editTimeSlot)}
        onOpenChange={(open) => !open && setEditTimeSlot(undefined)}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Time Slot?"
        description={`Delete time slot ${deleteConfirm.timeSlot?.startTime} - ${deleteConfirm.timeSlot?.endTime}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
