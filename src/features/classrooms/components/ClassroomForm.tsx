"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { classroomSchema, type ClassroomSchema } from "../schema/classroom.schema";
import { useClassroomActions } from "../hooks/useClassroomActions";
import type { Classroom } from "../types";

interface ClassroomFormProps {
  mode: "create" | "update";
  classroom?: Classroom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassroomForm({
  mode,
  classroom,
  open,
  onOpenChange,
}: ClassroomFormProps) {
  const form = useForm<ClassroomSchema>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      roomNumber: classroom?.roomNumber ?? "",
      capacity: classroom?.capacity ?? 1,
    },
  });

  const { create, update, isLoading } = useClassroomActions();

  const onSubmit = async (data: ClassroomSchema) => {
    if (mode === "create") {
      await create(data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
      return;
    }

    if (classroom) {
      await update(classroom.classroomId, data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Classroom" : "Edit Classroom"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new classroom to the system."
              : "Update classroom information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Room Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., A101"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                loadingText={mode === "create" ? "Creating..." : "Updating..."}
              >
                {mode === "create" ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
