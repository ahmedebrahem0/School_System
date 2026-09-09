import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation,
} from "../api";
import type { CreateTimeSlotDto, UpdateTimeSlotDto } from "../types";

export const useTimeSlotActions = () => {
  const router = useRouter();
  const [createMutation, { isLoading: isCreating }] =
    useCreateTimeSlotMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateTimeSlotMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteTimeSlotMutation();

  const create = useCallback(
    async (
      data: CreateTimeSlotDto,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        await createMutation(data).unwrap();
        toast.success("Time slot created successfully");
        if (options.redirectToList) {
          router.push("/time-slots");
        }
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create time slot. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: UpdateTimeSlotDto,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        await updateMutation({ id, data }).unwrap();
        toast.success("Time slot updated successfully");
        if (options.redirectToList) {
          router.push("/time-slots");
        }
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update time slot. Please try again.";
        toast.error(message);
      }
    },
    [updateMutation, router]
  );

  const remove = useCallback(
    async (id: number, options: { onSuccess?: () => void } = {}) => {
      try {
        await deleteMutation(id).unwrap();
        toast.success("Time slot deleted successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete time slot. Please try again.";
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
