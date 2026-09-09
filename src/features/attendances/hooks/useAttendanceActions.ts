import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import {
  useCreateAttendanceMutation,
  useDeleteAttendanceMutation,
  useUpdateAttendanceMutation,
} from "../api";
import type { AttendanceFormData } from "../types";

export const useAttendanceActions = () => {
  const router = useRouter();
  const [createMutation, { isLoading: isCreating }] =
    useCreateAttendanceMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateAttendanceMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteAttendanceMutation();

  const create = useCallback(
    async (
      data: AttendanceFormData,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        const { redirectToList = false, onSuccess } = options;
        await createMutation(data).unwrap();
        toast.success("Attendance saved successfully");
        onSuccess?.();
        if (redirectToList) {
          router.push(ROUTES.ATTENDANCES.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to save attendance. Please try again.";
        toast.error(message);
      }
    },
    [createMutation, router]
  );

  const update = useCallback(
    async (
      id: number,
      data: AttendanceFormData,
      options: { redirectToDetail?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        const { redirectToDetail = true, onSuccess } = options;
        await updateMutation({ id, data }).unwrap();
        toast.success("Attendance updated successfully");
        onSuccess?.();
        if (redirectToDetail) {
          router.push(ROUTES.ATTENDANCES.DETAILS(id));
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update attendance. Please try again.";
        toast.error(message);
      }
    },
    [updateMutation, router]
  );

  const deleteAttendance = useCallback(
    async (
      id: number,
      options: { redirectToList?: boolean; onSuccess?: () => void } = {}
    ) => {
      try {
        const { redirectToList = false, onSuccess } = options;
        await deleteMutation(id).unwrap();
        toast.success("Attendance deleted successfully");
        onSuccess?.();
        if (redirectToList) {
          router.push(ROUTES.ATTENDANCES.LIST);
          router.refresh();
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete attendance. Please try again.";
        toast.error(message);
      }
    },
    [deleteMutation, router]
  );

  return {
    create,
    update,
    delete: deleteAttendance,
    isCreating,
    isUpdating,
    isDeleting,
    isLoading: isCreating || isUpdating || isDeleting,
  };
};
