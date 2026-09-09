import { useCallback } from "react";
import { toast } from "sonner";
import {
  useAssignRoleMutation,
  useDeleteAdminUserMutation,
  useRemoveRoleMutation,
} from "../api";
import type { AssignRoleDto, RemoveRoleDto } from "../types";

export const useAssignRole = () => {
  const [assignMutation, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [removeMutation, { isLoading: isRemoving }] = useRemoveRoleMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteAdminUserMutation();

  const assign = useCallback(
    async (
      data: AssignRoleDto,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await assignMutation(data).unwrap();
        toast.success("Role assigned successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to assign role. Please try again.";
        toast.error(message);
      }
    },
    [assignMutation]
  );

  const remove = useCallback(
    async (
      data: RemoveRoleDto,
      options: { onSuccess?: () => void } = {}
    ) => {
      try {
        await removeMutation(data).unwrap();
        toast.success("Role removed successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to remove role. Please try again.";
        toast.error(message);
      }
    },
    [removeMutation]
  );

  const deleteUser = useCallback(
    async (id: string, options: { onSuccess?: () => void } = {}) => {
      try {
        await deleteMutation(id).unwrap();
        toast.success("User deleted successfully");
        options.onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete user. Please try again.";
        toast.error(message);
      }
    },
    [deleteMutation]
  );

  return {
    assign,
    remove,
    deleteUser,
    isAssigning,
    isRemoving,
    isDeleting,
    isLoading: isAssigning || isRemoving || isDeleting,
  };
};
