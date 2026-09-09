"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubjectActions } from "../hooks/useSubjectActions";
import { subjectSchema, type SubjectSchema } from "../schema/subject.schema";
import type { SubjectFormData } from "../types";

interface SubjectFormProps {
  mode: "create" | "update";
  initialData?: SubjectFormData;
  subjectId?: number;
  onSuccess?: () => void;
}

export function SubjectForm({
  mode,
  initialData,
  subjectId,
  onSuccess,
}: SubjectFormProps) {
  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: initialData ?? {
      subjectName: "",
    },
  });

  const { create, update, isLoading } = useSubjectActions();

  const onSubmit = async (data: SubjectSchema) => {
    if (mode === "create") {
      await create(data, { redirectToList: true });
      onSuccess?.();
      return;
    }

    if (subjectId) {
      await update(subjectId, data, { redirectToDetail: true });
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subjectName" className="text-[14px] font-medium">
          Subject Name
        </Label>
        <Input
          id="subjectName"
          placeholder="Enter subject name"
          {...form.register("subjectName")}
          disabled={isLoading}
        />
        {form.formState.errors.subjectName && (
          <p className="text-[12px] text-red-500">
            {form.formState.errors.subjectName.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {mode === "create" ? "Create Subject" : "Update Subject"}
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
