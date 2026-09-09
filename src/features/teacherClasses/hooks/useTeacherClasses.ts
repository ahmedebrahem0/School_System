import { useCallback } from "react";
import { toast } from "sonner";
import {
  useCreateTeacherClassMutation,
  useDeleteTeacherClassMutation,
  useGetTeacherClassesByTeacherQuery,
} from "../api";
import type { CreateTeacherClassDto } from "../types";

export const useTeacherClasses = (teacherId?: number) => {
  const { data = [], isLoading, isError, refetch } = useGetTeacherClassesByTeacherQuery(teacherId || 0, {
    skip: !teacherId,
  });

  const [createMutation, { isLoading: isCreating }] =
    useCreateTeacherClassMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteTeacherClassMutation();

  const create = useCallback(
    async (
      data: CreateTeacherClassDto,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await createMutation(data).unwrap();
        toast.success("Class assigned to teacher successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to assign class. Please try again.";
        toast.error(message);
      }
    },
    [createMutation]
  );

  const remove = useCallback(
    async (
      teacherId: number,
      classId: number,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await deleteMutation({ teacherId, classId }).unwrap();
        toast.success("Class unassigned from teacher successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to unassign class. Please try again.";
        toast.error(message);
      }
    },
    [deleteMutation]
  );

  return {
    classes: data,
    isLoading,
    isError,
    isCreating,
    isDeleting,
    create,
    remove,
    refetch,
  };
};
