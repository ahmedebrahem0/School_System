import { useCallback } from "react";
import { toast } from "sonner";
import {
  useCreateTeacherSubjectMutation,
  useDeleteTeacherSubjectMutation,
  useGetTeacherSubjectsByTeacherQuery,
} from "../api";
import type { CreateTeacherSubjectDto } from "../types";

export const useTeacherSubjects = (teacherId?: number) => {
  const { data = [], isLoading, isError, refetch } = useGetTeacherSubjectsByTeacherQuery(teacherId || 0, {
    skip: !teacherId,
  });

  const [createMutation, { isLoading: isCreating }] =
    useCreateTeacherSubjectMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteTeacherSubjectMutation();

  const create = useCallback(
    async (
      data: CreateTeacherSubjectDto,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await createMutation(data).unwrap();
        toast.success("Subject assigned to teacher successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to assign subject. Please try again.";
        toast.error(message);
      }
    },
    [createMutation]
  );

  const remove = useCallback(
    async (
      teacherId: number,
      subjectId: number,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await deleteMutation({ teacherId, subjectId }).unwrap();
        toast.success("Subject unassigned from teacher successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to unassign subject. Please try again.";
        toast.error(message);
      }
    },
    [deleteMutation]
  );

  return {
    subjects: data,
    isLoading,
    isError,
    isCreating,
    isDeleting,
    create,
    remove,
    refetch,
  };
};
