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
import { teacherSubjectSchema, type TeacherSubjectSchema } from "../schema/teacher-subject.schema";
import { useTeacherSubjects } from "../hooks/useTeacherSubjects";
import { useGetSubjectsQuery } from "@/features/subjects/api";

interface TeacherSubjectFormProps {
  teacherId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherSubjectForm({
  teacherId,
  open,
  onOpenChange,
}: TeacherSubjectFormProps) {
  const form = useForm<TeacherSubjectSchema>({
    resolver: zodResolver(teacherSubjectSchema),
    defaultValues: {
      teacherId,
      subjectId: 0,
    },
  });

  const { create, isCreating } = useTeacherSubjects(teacherId);
  const { data: subjects = [] } = useGetSubjectsQuery();

  const onSubmit = async (data: TeacherSubjectSchema) => {
    await create(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset({ teacherId, subjectId: 0 });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Subject to Teacher</DialogTitle>
          <DialogDescription>
            Select a subject to assign to this teacher.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Subject</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? field.value.toString() : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                      disabled={isCreating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={subject.id.toString()}
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
                Assign Subject
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
