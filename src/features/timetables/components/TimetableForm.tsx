"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { timetableSchema, type TimetableSchema } from "../schema/timetable.schema";
import { useTimetableActions } from "../hooks/useTimetableActions";
import { useGetClassroomsQuery } from "@/features/classrooms/api";
import { useGetTimeSlotsQuery } from "@/features/timeSlots/api";
import { useGetClassesQuery } from "@/features/classes/api";
import { useGetSubjectsQuery } from "@/features/subjects/api";
import type { Timetable } from "../types";

interface TimetableFormProps {
  mode: "create" | "update";
  timetable?: Timetable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function TimetableForm({
  mode,
  timetable,
  open,
  onOpenChange,
}: TimetableFormProps) {
  const form = useForm<TimetableSchema>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      classId: timetable?.classId ?? 0,
      subjectId: timetable?.subjectId ?? 0,
      dayOfWeek: timetable?.dayOfWeek ?? "Monday",
      timeSlotId: timetable?.timeSlotId ?? 0,
      classroomId: timetable?.classroomId ?? 0,
    },
  });

  const { create, update, isLoading } = useTimetableActions();
  const { data: classrooms = [] } = useGetClassroomsQuery();
  const { data: timeSlots = [] } = useGetTimeSlotsQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();

  useEffect(() => {
    if (timetable) {
      form.reset({
        classId: timetable.classId,
        subjectId: timetable.subjectId,
        dayOfWeek: timetable.dayOfWeek,
        timeSlotId: timetable.timeSlotId,
        classroomId: timetable.classroomId,
      });
    }
  }, [timetable, form]);

  const onSubmit = async (data: TimetableSchema) => {
    if (mode === "create") {
      await create(data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
      return;
    }

    if (timetable) {
      await update(timetable.id, data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Timetable Entry" : "Edit Timetable Entry"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new timetable entry to the schedule."
              : "Update timetable entry information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem
                            key={cls.classId}
                            value={cls.classId.toString()}
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
                      disabled={isLoading}
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

            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Day of Week</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
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
              name="timeSlotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Time Slot</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? field.value.toString() : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem
                            key={slot.timeSlotId}
                            value={slot.timeSlotId.toString()}
                          >
                            {slot.startTime} - {slot.endTime}
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
              name="classroomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Classroom</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? field.value.toString() : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select classroom" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((room) => (
                          <SelectItem
                            key={room.classroomId}
                            value={room.classroomId.toString()}
                          >
                            {room.roomNumber} (Cap: {room.capacity})
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
