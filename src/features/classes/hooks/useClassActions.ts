// features/classes/hooks/useClassActions.ts

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from "../api";
import { ROUTES } from "@/constants/routes";
import type { ClassFormData } from "../types";

export const useClassActions = (): {
  create: (data: ClassFormData, options?: { redirectToList?: boolean }) => Promise<void>;
  isCreating: boolean;
  update: (id: number, data: ClassFormData, options?: { redirectToDetail?: boolean }) => Promise<void>;
  isUpdating: boolean;
  delete: (id: number, options?: { redirectToList?: boolean }) => Promise<void>;
  isDeleting: boolean;
  isLoading: boolean;
} => {
  const router = useRouter();

  const [createMutation, { isLoading: isCreating }] =
    useCreateClassMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateClassMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteClassMutation();

  const create = useCallback(
    async (data: ClassFormData, options: { redirectToList?: boolean } = {}) => {
      try {
        const { redirectToList = true } = options;
        await createMutation(data).unwrap();
        toast.success("Class created successfully");
        if (redirectToList) {
          router.push(ROUTES.CLASSES.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create class. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: ClassFormData,
      options: { redirectToDetail?: boolean } = {}
    ) => {
      try {
        const { redirectToDetail = true } = options;
        await updateMutation({ id, data }).unwrap();
        toast.success("Class updated successfully");
        if (redirectToDetail) {
          router.push(ROUTES.CLASSES.DETAIL(id));
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update class. Please try again.";
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
        toast.success("Class deleted successfully");
        if (redirectToList) {
          router.push(ROUTES.CLASSES.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete class. Please try again.";
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