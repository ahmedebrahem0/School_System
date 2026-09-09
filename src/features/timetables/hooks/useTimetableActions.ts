import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
} from "../api";
import type { CreateTimetableDto, UpdateTimetableDto } from "../types";

export const useTimetableActions = () => {
  const router = useRouter();
  const [createMutation, { isLoading: isCreating }] =
    useCreateTimetableMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateTimetableMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteTimetableMutation();

  const create = useCallback(
    async (
      data: CreateTimetableDto,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        await createMutation(data).unwrap();
        toast.success("Timetable entry created successfully");
        if (options.redirectToList) {
          router.push("/timetables");
        }
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create timetable entry. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: UpdateTimetableDto,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        await updateMutation({ id, data }).unwrap();
        toast.success("Timetable entry updated successfully");
        if (options.redirectToList) {
          router.push("/timetables");
        }
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update timetable entry. Please try again.";
        toast.error(message);
      }
    },
    [updateMutation, router]
  );

  const remove = useCallback(
    async (id: number, options: { onSuccess?: () => void } = {}) => {
      try {
        await deleteMutation(id).unwrap();
        toast.success("Timetable entry deleted successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete timetable entry. Please try again.";
        toast.error(message);
      }
    },
    [deleteMutation]
  );

  return {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
    isLoading: isCreating || isUpdating || isDeleting,
  };
};
