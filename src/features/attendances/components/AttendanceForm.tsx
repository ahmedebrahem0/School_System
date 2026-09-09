"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, GraduationCap, ListChecks } from "lucide-react";
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
import { ALL_ATTENDANCE_STATUSES } from "@/constants/attendance-status";
import { useGetStudentsQuery } from "@/features/students/api";
import { attendanceSchema, type AttendanceSchema } from "../schema/attendance.schema";
import { useAttendanceActions } from "../hooks/useAttendanceActions";
import type { Attendance, AttendanceFormData } from "../types";

interface AttendanceFormProps {
  attendance?: Attendance;
  mode?: "create" | "update";
  onSuccess?: () => void;
  onCancel?: () => void;
  redirectOnCreate?: boolean;
  redirectOnUpdate?: boolean;
}

const getToday = () => new Date().toISOString().slice(0, 10);

export function AttendanceForm({
  attendance,
  mode,
  onSuccess,
  onCancel,
  redirectOnCreate = false,
  redirectOnUpdate = false,
}: AttendanceFormProps) {
  const isEdit = mode === "update" || Boolean(attendance);
  const { create, update, isLoading } = useAttendanceActions();
  const { data: students = [], isLoading: isLoadingStudents } =
    useGetStudentsQuery();

  const form = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: attendance?.studentId ?? 0,
      date: attendance?.date?.slice(0, 10) ?? getToday(),
      status: attendance?.status ?? "Present",
    },
  });

  const onSubmit = async (values: AttendanceSchema) => {
    const payload: AttendanceFormData = {
      studentId: values.studentId,
      date: values.date,
      status: values.status,
    };

    if (isEdit && attendance) {
      await update(attendance.attendanceId, payload, {
        redirectToDetail: redirectOnUpdate,
        onSuccess,
      });
      return;
    }

    await create(payload, {
      redirectToList: redirectOnCreate,
      onSuccess: () => {
        form.reset({
          studentId: 0,
          date: getToday(),
          status: "Present",
        });
        onSuccess?.();
      },
    });
  };

  const disabled = isLoading || isLoadingStudents;

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
            name="date"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    leftIcon={<CalendarDays size={15} />}
                    error={!!fieldState.error}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Status</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger error={!!fieldState.error}>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <ListChecks size={15} />
                        <SelectValue placeholder="Select status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_ATTENDANCE_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            {isEdit ? "Save Changes" : "Add Attendance"}
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
