// features/teachers/hooks/useTeacherActions.ts

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
  useUpdateTeacherMutation,
} from "../api";
import { ROUTES } from "@/constants/routes";
import type { TeacherFormData } from "../types";

export const useTeacherActions = (): {
  create: (
    data: TeacherFormData,
    options?: { redirectToList?: boolean }
  ) => Promise<void>;
  isCreating: boolean;
  update: (
    id: number,
    data: TeacherFormData,
    options?: { redirectToDetail?: boolean }
  ) => Promise<void>;
  isUpdating: boolean;
  delete: (
    id: number,
    options?: { redirectToList?: boolean }
  ) => Promise<void>;
  isDeleting: boolean;
  isLoading: boolean;
} => {
  const router = useRouter();

  const [createMutation, { isLoading: isCreating }] =
    useCreateTeacherMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateTeacherMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteTeacherMutation();

  const create = useCallback(
    async (
      data: TeacherFormData,
      options: { redirectToList?: boolean } = {}
    ) => {
      try {
        const { redirectToList = true } = options;
        await createMutation({ Name: data.name }).unwrap();
        toast.success("Teacher created successfully");
        if (redirectToList) {
          router.push(ROUTES.TEACHERS.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create teacher. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: TeacherFormData,
      options: { redirectToDetail?: boolean } = {}
    ) => {
      try {
        const { redirectToDetail = true } = options;
        await updateMutation({ id, data: { Name: data.name } }).unwrap();
        toast.success("Teacher updated successfully");
        if (redirectToDetail) {
          router.push(ROUTES.TEACHERS.DETAILS(id));
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update teacher. Please try again.";
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
        toast.success("Teacher deleted successfully");
        if (redirectToList) {
          router.push(ROUTES.TEACHERS.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete teacher. Please try again.";
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
