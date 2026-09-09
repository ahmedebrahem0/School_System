"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeacherActions } from "../hooks/useTeacherActions";
import { teacherSchema, type TeacherSchema } from "../schema/teacher.schema";
import type { TeacherFormData } from "../types";

interface TeacherFormProps {
  mode: "create" | "update";
  initialData?: TeacherFormData;
  teacherId?: number;
  onSuccess?: () => void;
}

export function TeacherForm({
  mode,
  initialData,
  teacherId,
  onSuccess,
}: TeacherFormProps) {
  const form = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialData ?? {
      name: "",
    },
  });

  const { create, update, isLoading } = useTeacherActions();

  const onSubmit = async (data: TeacherSchema) => {
    if (mode === "create") {
      await create(data, { redirectToList: true });
      onSuccess?.();
      return;
    }

    if (teacherId) {
      await update(teacherId, data, { redirectToDetail: true });
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[14px] font-medium">
          Teacher Name
        </Label>
        <Input
          id="name"
          placeholder="Enter teacher name"
          {...form.register("name")}
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="text-[12px] text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {mode === "create" ? "Create Teacher" : "Update Teacher"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
