// features/students/hooks/useStudentActions.ts

// Student mutations hook
// Handles create, update, delete operations with loading + error handling
// Shows toasts for success/error feedback

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from "../api";
import { ROUTES } from "@/constants/routes";
import type { CreateStudentDto, UpdateStudentDto, StudentFormData } from "../types";

// ─────────────────────────────────────────────────────
// CREATE MUTATION OPTIONS
// ─────────────────────────────────────────────────────
interface CreateOptions {
  onSuccess?: () => void;
  redirectToList?: boolean;
}

// ─────────────────────────────────────────────────────
// UPDATE MUTATION OPTIONS
// ─────────────────────────────────────────────────────
interface UpdateOptions {
  onSuccess?: () => void;
  redirectToDetail?: boolean;
}

// ─────────────────────────────────────────────────────
// DELETE MUTATION OPTIONS
// ─────────────────────────────────────────────────────
interface DeleteOptions {
  onSuccess?: () => void;
  redirectToList?: boolean;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN TYPE
// All mutation operations and states
// ─────────────────────────────────────────────────────
interface UseStudentActionsReturn {
  // Create
  create: (data: StudentFormData, options?: CreateOptions) => Promise<void>;
  isCreating: boolean;

  // Update
  update: (id: number, data: StudentFormData, options?: UpdateOptions) => Promise<void>;
  isUpdating: boolean;

  // Delete
  delete: (id: number, options?: DeleteOptions) => Promise<void>;
  isDeleting: boolean;

  // Overall
  isLoading: boolean; // true if any operation is loading
}

// ─────────────────────────────────────────────────────
// USE STUDENT ACTIONS HOOK
// ─────────────────────────────────────────────────────
export const useStudentActions = (): UseStudentActionsReturn => {
  const router = useRouter();

  // ─────────────────────────────────────────────────
  // RTK Query Mutations
  // Auto-generated from api.ts
  // ─────────────────────────────────────────────────
  const [createStudentMutation, { isLoading: isCreating }] =
    useCreateStudentMutation();

  const [updateStudentMutation, { isLoading: isUpdating }] =
    useUpdateStudentMutation();

  const [deleteStudentMutation, { isLoading: isDeleting }] =
    useDeleteStudentMutation();

  // ─────────────────────────────────────────────────
  // CREATE STUDENT
  // POST /api/Students (multipart/form-data)
  //
  // Flow:
  //   1. Convert form data to CreateStudentDto (capitalize field names)
  //   2. Call createStudentMutation
  //   3. On success: show toast + redirect
  //   4. On error: show error toast
  // ─────────────────────────────────────────────────
  const create = useCallback(
    async (data: StudentFormData, options: CreateOptions = {}) => {
      try {
        const { onSuccess, redirectToList = true } = options;

        // ─────────────────────────────────────────
        // Convert StudentFormData to CreateStudentDto
        // POST uses capitalized field names: Name, DateOfBirth, ClassId
        // ─────────────────────────────────────────
        const createDto: CreateStudentDto = {
          Name: data.name,
          DateOfBirth: data.dateOfBirth,
          ClassId: data.classId,
        };

        // Call mutation
        await createStudentMutation(createDto).unwrap();

        // Show success toast
        toast.success("Student created successfully");

        // Call optional callback
        if (onSuccess) {
          onSuccess();
        }

        // Redirect to list
        if (redirectToList) {
          router.push(ROUTES.STUDENTS.LIST);
          router.refresh(); // Refresh server components
        }

      } catch (error) {
        // Handle error
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create student. Please try again.";

        toast.error(message);
      }
    },
    [createStudentMutation, router]
  );

  // ─────────────────────────────────────────────────
  // UPDATE STUDENT
  // PUT /api/Students/{id} (application/json)
  //
  // Flow:
  //   1. Keep form data as-is (lowercase field names)
  //   2. Call updateStudentMutation with id + data
  //   3. On success: show toast + redirect to detail
  //   4. On error: show error toast
  // ─────────────────────────────────────────────────
  const update = useCallback(
    async (
      id: number,
      data: StudentFormData,
      options: UpdateOptions = {}
    ) => {
      try {
        const { onSuccess, redirectToDetail = true } = options;

        // ─────────────────────────────────────────
        // Convert StudentFormData to UpdateStudentDto
        // PUT uses lowercase field names: name, dateOfBirth, classId
        // ─────────────────────────────────────────
        const updateDto: UpdateStudentDto = {
          name: data.name,
          dateOfBirth: data.dateOfBirth,
          classId: data.classId,
        };

        // Call mutation
        await updateStudentMutation({ id, data: updateDto }).unwrap();

        // Show success toast
        toast.success("Student updated successfully");

        // Call optional callback
        if (onSuccess) {
          onSuccess();
        }

        // Redirect to detail page
        if (redirectToDetail) {
          router.push(ROUTES.STUDENTS.DETAIL(id));
          router.refresh();
        }

      } catch (error) {
        // Handle error
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update student. Please try again.";

        toast.error(message);
      }
    },
    [updateStudentMutation, router]
  );

  // ─────────────────────────────────────────────────
  // DELETE STUDENT
  // DELETE /api/Students?id={id}
  //
  // Flow:
  //   1. Call deleteStudentMutation with id
  //   2. On success: show toast + redirect to list
  //   3. On error: show error toast
  // ─────────────────────────────────────────────────
  const delete_ = useCallback(
    async (id: number, options: DeleteOptions = {}) => {
      try {
        const { onSuccess, redirectToList = true } = options;

        // Call mutation
        await deleteStudentMutation(id).unwrap();

        // Show success toast
        toast.success("Student deleted successfully");

        // Call optional callback
        if (onSuccess) {
          onSuccess();
        }

        // Redirect to list
        if (redirectToList) {
          router.push(ROUTES.STUDENTS.LIST);
          router.refresh();
        }

      } catch (error) {
        // Handle error
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete student. Please try again.";

        toast.error(message);
      }
    },
    [deleteStudentMutation, router]
  );

  return {
    // Create
    create,
    isCreating,

    // Update
    update,
    isUpdating,

    // Delete
    delete: delete_,
    isDeleting,

    // Overall loading state (true if any operation is loading)
    isLoading: isCreating || isUpdating || isDeleting,
  };
};