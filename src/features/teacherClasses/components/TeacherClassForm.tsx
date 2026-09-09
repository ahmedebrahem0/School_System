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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teacherClassSchema, type TeacherClassSchema } from "../schema/teacher-class.schema";
import { useTeacherClasses } from "../hooks/useTeacherClasses";
import { useGetClassesQuery } from "@/features/classes/api";

interface TeacherClassFormProps {
  teacherId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherClassForm({
  teacherId,
  open,
  onOpenChange,
}: TeacherClassFormProps) {
  const form = useForm<TeacherClassSchema>({
    resolver: zodResolver(teacherClassSchema),
    defaultValues: {
      teacherId,
      classId: 0,
    },
  });

  const { create, isCreating } = useTeacherClasses(teacherId);
  const { data: classes = [] } = useGetClassesQuery();

  const onSubmit = async (data: TeacherClassSchema) => {
    await create(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset({ teacherId, classId: 0 });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Class to Teacher</DialogTitle>
          <DialogDescription>
            Select a class to assign to this teacher.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Class</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? field.value.toString() : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                      disabled={isCreating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem
                            key={cls.id}
                            value={cls.id.toString()}
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

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isCreating}
                loadingText="Assigning..."
              >
                Assign Class
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
