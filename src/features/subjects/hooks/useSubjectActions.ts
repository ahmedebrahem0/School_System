// features/subjects/hooks/useSubjectActions.ts

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from "../api";
import { ROUTES } from "@/constants/routes";
import type { SubjectFormData } from "../types";

export const useSubjectActions = (): {
  create: (data: SubjectFormData, options?: { redirectToList?: boolean }) => Promise<void>;
  isCreating: boolean;
  update: (id: number, data: SubjectFormData, options?: { redirectToDetail?: boolean }) => Promise<void>;
  isUpdating: boolean;
  delete: (id: number, options?: { redirectToList?: boolean }) => Promise<void>;
  isDeleting: boolean;
  isLoading: boolean;
} => {
  const router = useRouter();

  const [createMutation, { isLoading: isCreating }] =
    useCreateSubjectMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateSubjectMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteSubjectMutation();

  const create = useCallback(
    async (data: SubjectFormData, options: { redirectToList?: boolean } = {}) => {
      try {
        const { redirectToList = true } = options;
        await createMutation(data).unwrap();
        toast.success("Subject created successfully");
        if (redirectToList) {
          router.push(ROUTES.SUBJECTS.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create subject. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: SubjectFormData,
      options: { redirectToDetail?: boolean } = {}
    ) => {
      try {
        const { redirectToDetail = true } = options;
        await updateMutation({ id, data }).unwrap();
        toast.success("Subject updated successfully");
        if (redirectToDetail) {
          router.push(ROUTES.SUBJECTS.DETAIL(id));
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update subject. Please try again.";
        toast.error(message);
      }
    },
    [updateMutation, router]
  );

  const delete_ = useCallback(
    async (id: number, options: { redirectToList?: boolean } = {}) => {
      try {
        const { redirectToList = true } = options;
        await deleteMutation(id).unwrap();
        toast.success("Subject deleted successfully");
        if (redirectToList) {
          router.push(ROUTES.SUBJECTS.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete subject. Please try again.";
        toast.error(message);
      }
    },
    [deleteMutation, router]
  );

  return {
    create,
    isCreating,
    update,
    isUpdating,
    delete: delete_,
    isDeleting,
    isLoading: isCreating || isUpdating || isDeleting,
  };
};