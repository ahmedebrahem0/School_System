import { toast } from "sonner"
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from "../api"
import type { CreateStudentDto, UpdateStudentDto } from "../types"

export function useStudentActions() {
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation()
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation()
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation()

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async (
    dto: CreateStudentDto,
    options?: { onSuccess?: () => void }
  ) => {
    try {
      await createStudent(dto).unwrap()
      toast.success("Student created successfully", {
        description: `${dto.Name} has been added to the system.`,
      })
      options?.onSuccess?.()
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to create student"
      toast.error("Error", { description: message })
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async (
    id: number,
    dto: UpdateStudentDto,
    options?: { onSuccess?: () => void }
  ) => {
    try {
      await updateStudent({ id, dto }).unwrap()
      toast.success("Student updated successfully", {
        description: `${dto.name}'s information has been updated.`,
      })
      options?.onSuccess?.()
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to update student"
      toast.error("Error", { description: message })
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (
    id: number,
    name: string,
    options?: { onSuccess?: () => void }
  ) => {
    try {
      await deleteStudent(id).unwrap()
      toast.success("Student deleted", {
        description: `${name} has been permanently removed.`,
      })
      options?.onSuccess?.()
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete student"
      toast.error("Error", { description: message })
    }
  }

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting,
    isLoading: isCreating || isUpdating || isDeleting,
  }
}