// features/classes/components/ClassForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema, type ClassSchema } from "../schema/class.schema";
import { useClassActions } from "../hooks/useClassActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClassFormData } from "../types";

interface ClassFormProps {
  mode: "create" | "update";
  initialData?: ClassFormData;
  classId?: number;
  onSuccess?: () => void;
}

export function ClassForm({
  mode,
  initialData,
  classId,
  onSuccess,
}: ClassFormProps) {
  const form = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: initialData || {
      className: "",
    },
  });

  const { create, update, isLoading } = useClassActions();

  const onSubmit = async (data: ClassSchema) => {
    try {
      if (mode === "create") {
        await create(data, { redirectToList: true });
      } else if (mode === "update" && classId) {
        await update(classId, data, { redirectToDetail: true });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="className" className="text-[14px] font-medium">
          Class Name *
        </Label>
        <Input
          id="className"
          placeholder="Enter class name (e.g., Class A)"
          {...form.register("className")}
          disabled={isLoading}
          className="h-9"
        />
        {form.formState.errors.className && (
          <p className="text-[12px] text-red-500">
            {form.formState.errors.className.message}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create Class"
          ) : (
            "Update Class"
          )}
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