"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, GraduationCap, Percent } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStudentsQuery } from "@/features/students/api";
import { useGetSubjectsQuery } from "@/features/subjects/api";
import { gradeSchema, type GradeSchema } from "../schema/grade.schema";
import { useGradeActions } from "../hooks/useGradeActions";
import type { Grade, GradeFormData } from "../types";

interface GradeFormProps {
  grade?: Grade;
  mode?: "create" | "update";
  onSuccess?: () => void;
  onCancel?: () => void;
  redirectOnUpdate?: boolean;
}

export function GradeForm({
  grade,
  mode,
  onSuccess,
  onCancel,
  redirectOnUpdate = false,
}: GradeFormProps) {
  const isEdit = mode === "update" || Boolean(grade);
  const { create, update, isLoading } = useGradeActions();
  const { data: students = [], isLoading: isLoadingStudents } =
    useGetStudentsQuery();
  const { data: subjects = [], isLoading: isLoadingSubjects } =
    useGetSubjectsQuery();

  const form = useForm<GradeSchema>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: grade?.studentId ?? 0,
      subjectId: grade?.subjectId ?? 0,
      grade: grade?.grade ?? 0,
    },
  });

  const onSubmit = async (values: GradeSchema) => {
    const payload: GradeFormData = {
      studentId: values.studentId,
      subjectId: values.subjectId,
      grade: values.grade,
    };

    if (isEdit && grade) {
      await update(grade.id, payload, {
        redirectToDetail: redirectOnUpdate,
        onSuccess,
      });
      return;
    }

    await create(payload, {
      redirectToList: false,
      onSuccess: () => {
        form.reset({ studentId: 0, subjectId: 0, grade: 0 });
        onSuccess?.();
      },
    });
  };

  const disabled = isLoading || isLoadingStudents || isLoadingSubjects;

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Student</FormLabel>
                <FormControl>
                  <Select
                    value={field.value > 0 ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={disabled}
                  >
                    <SelectTrigger error={!!fieldState.error}>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <GraduationCap size={15} />
                        <SelectValue placeholder="Select student" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem
                          key={student.studentId}
                          value={String(student.studentId)}
                        >
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Subject</FormLabel>
                <FormControl>
                  <Select
                    value={field.value > 0 ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={disabled}
                  >
                    <SelectTrigger error={!!fieldState.error}>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <BookOpen size={15} />
                        <SelectValue placeholder="Select subject" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject.subjectId}
                          value={String(subject.subjectId)}
                        >
                          {subject.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Grade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    placeholder="0-100"
                    leftIcon={<Percent size={15} />}
                    error={!!fieldState.error}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            loading={isLoading}
            loadingText={isEdit ? "Saving..." : "Adding..."}
          >
            {isEdit ? "Save Changes" : "Add Grade"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={disabled}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
