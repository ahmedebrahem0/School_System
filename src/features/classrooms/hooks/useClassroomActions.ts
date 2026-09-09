import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
} from "../api";
import type { CreateClassroomDto, UpdateClassroomDto } from "../types";

export const useClassroomActions = () => {
  const router = useRouter();
  const [createMutation, { isLoading: isCreating }] =
    useCreateClassroomMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateClassroomMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteClassroomMutation();

  const create = useCallback(
    async (
      data: CreateClassroomDto,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        await createMutation(data).unwrap();
        toast.success("Classroom created successfully");
        if (options.redirectToList) {
          router.push("/classrooms");
        }
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create classroom. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: UpdateClassroomDto,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        await updateMutation({ id, data }).unwrap();
        toast.success("Classroom updated successfully");
        if (options.redirectToList) {
          router.push("/classrooms");
        }
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update classroom. Please try again.";
        toast.error(message);
      }
    },
    [updateMutation, router]
  );

  const remove = useCallback(
    async (id: number, options: { onSuccess?: () => void } = {}) => {
      try {
        await deleteMutation(id).unwrap();
        toast.success("Classroom deleted successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete classroom. Please try again.";
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
