"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { UserRound, Calendar, School } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStudentActions } from "../hooks/useStudentActions"
import { studentSchema, type StudentFormValues } from "../schema/student.schema"
import { useGetClassesQuery } from "@/features/classes/api"
import { ROUTES } from "@/constants/routes"
import type { StudentDetails } from "../types"

interface StudentFormProps {
  /** If provided → edit mode. If not → create mode */
  student?: StudentDetails
}

export function StudentForm({ student }: StudentFormProps) {
  const router = useRouter()
  const isEdit = !!student

  const { handleCreate, handleUpdate, isCreating, isUpdating } =
    useStudentActions()

  // ── Classes for dropdown ─────────────────────────────────────────────────
  const { data: classes = [], isLoading: isLoadingClasses } =
    useGetClassesQuery()

  // ── Form ─────────────────────────────────────────────────────────────────
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      classId: undefined,
    },
  })

  // Populate form in edit mode
  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        dateOfBirth: student.dateOfBirth ?? "",
        classId: student.classId ?? undefined,
      })
    }
  }, [student, form])

  // ── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (values: StudentFormValues) => {
    if (isEdit && student) {
      await handleUpdate(
        student.studentId,
        {
          name: values.name,
          dateOfBirth: values.dateOfBirth || undefined,
          classId: values.classId,
        },
        { onSuccess: () => router.push(ROUTES.STUDENTS.LIST) }
      )
    } else {
      await handleCreate(
        {
          Name: values.name,
          DateOfBirth: values.dateOfBirth || undefined,
          ClassId: values.classId,
        },
        { onSuccess: () => router.push(ROUTES.STUDENTS.LIST) }
      )
    }
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        {/* ── Name ────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Ahmed Hassan"
                  leftIcon={<UserRound size={15} />}
                  error={!!fieldState.error}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Date of Birth ────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  leftIcon={<Calendar size={15} />}
                  error={!!fieldState.error}
                  disabled={isSubmitting}
                  max={new Date().toISOString().split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Class ───────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="classId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <Select
                  value={field.value !== undefined ? String(field.value) : ""}
                  onValueChange={(val) =>
                    field.onChange(val ? Number(val) : undefined)
                  }
                  disabled={isSubmitting || isLoadingClasses}
                >
                  <SelectTrigger
                    error={!!fieldState.error}
                    className="w-full"
                  >
                    <div className="flex items-center gap-2 text-zinc-400">
                      <School size={15} />
                      <SelectValue placeholder="Select a class" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem
                        key={cls.classId}
                        value={String(cls.classId)}
                      >
                        {cls.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            loading={isSubmitting}
            loadingText={isEdit ? "Saving..." : "Creating..."}
            className="min-w-[120px]"
          >
            {isEdit ? "Save Changes" : "Create Student"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(ROUTES.STUDENTS.LIST)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}