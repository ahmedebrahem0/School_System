import { useCallback } from "react";
import { toast } from "sonner";
import {
  useCreateClassSubjectMutation,
  useDeleteClassSubjectMutation,
  useGetClassSubjectsByClassQuery,
} from "../api";
import type { CreateClassSubjectDto } from "../types";

export const useClassSubjects = (classId?: number) => {
  const { data = [], isLoading, isError, refetch } = useGetClassSubjectsByClassQuery(classId || 0, {
    skip: !classId,
  });

  const [createMutation, { isLoading: isCreating }] =
    useCreateClassSubjectMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteClassSubjectMutation();

  const create = useCallback(
    async (
      data: CreateClassSubjectDto,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await createMutation(data).unwrap();
        toast.success("Subject linked to class successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to link subject. Please try again.";
        toast.error(message);
      }
    },
    [createMutation]
  );

  const remove = useCallback(
    async (
      classId: number,
      subjectId: number,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await deleteMutation({ classId, subjectId }).unwrap();
        toast.success("Subject unlinked from class successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to unlink subject. Please try again.";
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
