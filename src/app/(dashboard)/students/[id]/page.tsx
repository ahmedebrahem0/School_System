"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import { StudentCard } from "@/features/students/components/StudentCard"
import { StudentForm } from "@/features/students/components/StudentForm"
import { StudentCardSkeleton } from "@/features/students/components/StudentCard.skeleton"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useStudent } from "@/features/students/hooks/useStudent"
import { useStudentActions } from "@/features/students/hooks/useStudentActions"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { ROUTES } from "@/constants/routes"
import type { StudentDetails } from "@/features/students/types"

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const studentId = Number(id)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<StudentDetails | null>(null)

  const { student, isLoading, isError } = useStudent(studentId)
  const { handleDelete, isDeleting } = useStudentActions()

  // ── Delete handler ────────────────────────────────────────────────────────
  const onConfirmDelete = async () => {
    if (!deleteTarget) return
    await handleDelete(deleteTarget.studentId, deleteTarget.name, {
      onSuccess: () => router.push(ROUTES.STUDENTS.LIST),
    })
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <PageHeader
          breadcrumb={["Dashboard", "Students", "Student Details"]}
          title="Student Details"
        />
        <StudentCardSkeleton />
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !student) {
    return (
      <div className="space-y-6 max-w-2xl">
        <PageHeader
          breadcrumb={["Dashboard", "Students", "Student Details"]}
          title="Student Details"
        />
        <ErrorMessage
          title="Student not found"
          description="This student may have been deleted or doesn't exist."
          action={{
            label: "Back to Students",
            onClick: () => router.push(ROUTES.STUDENTS.LIST),
          }}
        />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 max-w-2xl">
        <PageHeader
          breadcrumb={["Dashboard", "Students", student.name]}
          title={student.name}
          description={`Student ID: ${student.studentId}`}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(ROUTES.STUDENTS.LIST)}
              >
                <ArrowLeft size={15} />
                Back
              </Button>
              <Button size="sm" onClick={() => setEditOpen(true)}>
                <Pencil size={15} />
                Edit Student
              </Button>
            </div>
          }
        />

        <StudentCard
          student={student as StudentDetails}
          onDelete={(s) => setDeleteTarget(s)}
        />
      </div>

      {/* ── Edit Sheet ──────────────────────────────────────────────────── */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="w-[440px] overflow-y-auto">
          <SheetHeader className="mb-2">
            <SheetTitle>Edit Student</SheetTitle>
            <SheetDescription>
              Update {student.name}&apos;s information below.
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 pb-6">
            <StudentForm
              student={student as StudentDetails}
              onSuccess={() => setEditOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Confirm Delete ──────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name ?? "Student"}?`}
        description="This action cannot be undone. All data for this student will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}
