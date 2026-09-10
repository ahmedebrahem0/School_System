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
import { classSubjectSchema, type ClassSubjectSchema } from "../schema/class-subject.schema";
import { useClassSubjects } from "../hooks/useClassSubjects";
import { useGetSubjectsQuery } from "@/features/subjects/api";

interface ClassSubjectFormProps {
  classId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassSubjectForm({
  classId,
  open,
  onOpenChange,
}: ClassSubjectFormProps) {
  const form = useForm<ClassSubjectSchema>({
    resolver: zodResolver(classSubjectSchema),
    defaultValues: {
      classId,
      subjectId: 0,
    },
  });

  const { create, isCreating } = useClassSubjects(classId);
  const { data: subjects = [] } = useGetSubjectsQuery();

  const onSubmit = async (data: ClassSubjectSchema) => {
    await create(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset({ classId, subjectId: 0 });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Subject to Class</DialogTitle>
          <DialogDescription>
            Select a subject to link with this class.
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
                            key={subject.subjectId}
                            value={subject.subjectId.toString()}
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
                loadingText="Linking..."
              >
                Link Subject
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
