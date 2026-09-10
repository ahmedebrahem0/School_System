import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateGradeMutation,
  useDeleteGradeMutation,
  useUpdateGradeMutation,
} from "../api";
import { ROUTES } from "@/constants/routes";
import type { GradeFormData } from "../types";
// Hook for managing grade actions
export const useGradeActions = () => {
  const router = useRouter();
  const [createMutation, { isLoading: isCreating }] = useCreateGradeMutation();
  const [updateMutation, { isLoading: isUpdating }] = useUpdateGradeMutation();
  const [deleteMutation, { isLoading: isDeleting }] = useDeleteGradeMutation();

  const create = useCallback(
    async (
      data: GradeFormData,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        const { redirectToList = false, onSuccess } = options;
        await createMutation(data).unwrap();
        toast.success("Grade saved successfully");
        onSuccess?.();
        if (redirectToList) {
          router.push(ROUTES.GRADES.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to save grade. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: GradeFormData,
      options: { redirectToDetail?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        const { redirectToDetail = true, onSuccess } = options;
        await updateMutation({ id, data }).unwrap();
        toast.success("Grade updated successfully");
        onSuccess?.();
        if (redirectToDetail) {
          router.push(ROUTES.GRADES.DETAILS(id));
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update grade. Please try again.";
        toast.error(message);
      }
    },
    [updateMutation, router]
  );

  const deleteGrade = useCallback(
    async (
      id: number,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        const { redirectToList = false, onSuccess } = options;
        await deleteMutation(id).unwrap();
        toast.success("Grade deleted successfully");
        onSuccess?.();
        if (redirectToList) {
          router.push(ROUTES.GRADES.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete grade. Please try again.";
        toast.error(message);
      }
    },
    [deleteMutation, router]
  );

  return {
    create,
    update,
    delete: deleteGrade,
    isCreating,
    isUpdating,
    isDeleting,
    isLoading: isCreating || isUpdating || isDeleting,
  };
};
