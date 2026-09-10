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
import { timeSlotSchema, type TimeSlotSchema } from "../schema/timeSlot.schema";
import { useTimeSlotActions } from "../hooks/useTimeSlotActions";
import type { TimeSlot } from "../types";

interface TimeSlotFormProps {
  mode: "create" | "update";
  timeSlot?: TimeSlot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimeSlotForm({
  mode,
  timeSlot,
  open,
  onOpenChange,
}: TimeSlotFormProps) {
  const form = useForm<TimeSlotSchema>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      startTime: timeSlot?.startTime ?? "",
      endTime: timeSlot?.endTime ?? "",
    },
  });

  const { create, update, isLoading } = useTimeSlotActions();

  const onSubmit = async (data: TimeSlotSchema) => {
    if (mode === "create") {
      await create(data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
      return;
    }

    if (timeSlot) {
      await update(timeSlot.timeSlotId, data, {
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
            {mode === "create" ? "Create Time Slot" : "Edit Time Slot"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new time slot for class schedules."
              : "Update time slot information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="09:00"
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
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="10:00"
                      disabled={isLoading}
                      {...field}
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
