"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGetAdminUsersQuery } from "@/features/admin/api";
import { useGetClassesQuery } from "@/features/classes/api";
import { useGetSubjectsQuery } from "@/features/subjects/api";
import {
  useGetMyTeacherClassesQuery,
  useGetMyTeacherSubjectsQuery,
} from "@/features/teachers/api";
import { ROLES } from "@/constants/roles";
import { useCancelScheduledNotificationMutation, useSendNotificationMutation } from "../api";
import {
  sendNotificationSchema,
  type SendNotificationFormData,
} from "../schema/sendNotification.schema";
import {
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_TYPES,
  type NotificationTargetType,
  type SendNotificationResponse,
} from "../types";

interface TargetOption {
  value: string;
  label: string;
}

const ADMIN_TARGETS: NotificationTargetType[] = [
  "User",
  "Role",
  "Class",
  "SchoolGrade",
  "Subject",
  "All",
];
const TEACHER_TARGETS: NotificationTargetType[] = ["User", "Class", "Subject"];

function errorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }
  return "Notification could not be sent";
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-[12px] text-red-500">{message}</p> : null;
}

export function SendNotificationForm() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const isTeacher = user?.role === ROLES.TEACHER;
  const allowedTargets = isAdmin ? ADMIN_TARGETS : TEACHER_TARGETS;
  const defaultTarget = isAdmin ? "Role" : "Class";

  const form = useForm<SendNotificationFormData>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "Announcement",
      priority: "Normal",
      targetType: defaultTarget,
      targetId: "",
      deliveryMode: "Immediate",
      scheduledAtLocal: "",
      expiresAtLocal: "",
    },
  });
  const targetType = useWatch({ control: form.control, name: "targetType" });
  const deliveryMode = useWatch({ control: form.control, name: "deliveryMode" });
  const [sendNotification, sendState] = useSendNotificationMutation();
  const [cancelScheduled, cancelState] = useCancelScheduledNotificationMutation();
  const [receipt, setReceipt] = useState<SendNotificationResponse | null>(null);
  const [operationKey, setOperationKey] = useState<string | null>(null);

  const adminUsers = useGetAdminUsersQuery(undefined, {
    skip: !isAdmin || targetType !== "User",
  });
  const classes = useGetClassesQuery(undefined, {
    skip: !isAdmin || !["Class", "SchoolGrade"].includes(targetType),
  });
  const subjects = useGetSubjectsQuery(undefined, {
    skip: !isAdmin || targetType !== "Subject",
  });
  const myClasses = useGetMyTeacherClassesQuery(undefined, {
    skip: !isTeacher || targetType !== "Class",
  });
  const mySubjects = useGetMyTeacherSubjectsQuery(undefined, {
    skip: !isTeacher || targetType !== "Subject",
  });

  const targetOptions = useMemo<TargetOption[]>(() => {
    switch (targetType) {
      case "Role":
        return ["Admin", "Teacher", "Student"].map((role) => ({
          value: role,
          label: role,
        }));
      case "User":
        return isAdmin
          ? (adminUsers.data ?? []).map((account) => ({
              value: account.id,
              label: account.fullName || account.email || account.userName || account.id,
            }))
          : [];
      case "Class":
        return isAdmin
          ? (classes.data ?? []).map((item) => ({
              value: String(item.classId),
              label: item.className,
            }))
          : (myClasses.data ?? []).map((item) => ({
              value: String(item.id),
              label: item.name,
            }));
      case "Subject":
        return isAdmin
          ? (subjects.data ?? []).map((item) => ({
              value: String(item.subjectId),
              label: item.subjectName,
            }))
          : (mySubjects.data ?? []).map((item) => ({
              value: String(item.id),
              label: item.name,
            }));
      case "SchoolGrade": {
        const unique = new Map<number, string>();
        (classes.data ?? []).forEach((item) => {
          if (item.schoolGradeId && item.schoolGradeName) {
            unique.set(item.schoolGradeId, item.schoolGradeName);
          }
        });
        return Array.from(unique, ([value, label]) => ({
          value: String(value),
          label,
        }));
      }
      default:
        return [];
    }
  }, [
    adminUsers.data,
    classes.data,
    isAdmin,
    myClasses.data,
    mySubjects.data,
    subjects.data,
    targetType,
  ]);

  if (!isAdmin && !isTeacher) return null;

  const changeTargetType = (value: NotificationTargetType) => {
    form.setValue("targetType", value, { shouldValidate: true });
    form.setValue("targetId", "", { shouldValidate: false });
    setReceipt(null);
    setOperationKey(null);
  };

  const onSubmit = async (values: SendNotificationFormData) => {
    const key = operationKey ?? crypto.randomUUID();
    if (!operationKey) setOperationKey(key);

    try {
      const result = await sendNotification({
        data: {
          title: values.title, message: values.message, type: values.type, priority: values.priority, targetType: values.targetType,
          targetId: values.targetType === "All" ? undefined : values.targetId,
          scheduledAtUtc: values.deliveryMode === "Scheduled" ? new Date(values.scheduledAtLocal!).toISOString() : undefined,
          expiresAtUtc: values.expiresAtLocal ? new Date(values.expiresAtLocal).toISOString() : undefined,
        },
        idempotencyKey: key,
      }).unwrap();
      setReceipt(result);
      toast.success(
        result.wasDuplicate
          ? "This notification was already sent"
          : `Notification sent to ${result.recipientCount} recipient${result.recipientCount === 1 ? "" : "s"}`
      );
      setOperationKey(null);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const needsFreeTextTarget =
    targetType !== "All" && targetOptions.length === 0 && !sendState.isLoading;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111827]"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notification-title">Title</Label>
          <Input
            id="notification-title"
            maxLength={150}
            placeholder="Exam tomorrow"
            error={Boolean(form.formState.errors.title)}
            className="dark:border-white/10 dark:bg-[#0B1220] dark:text-zinc-100"
            {...form.register("title")}
          />
          <FieldError message={form.formState.errors.title?.message} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notification-message">Message</Label>
          <textarea
            id="notification-message"
            maxLength={1000}
            rows={5}
            placeholder="Write the notification message"
            className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[14px] text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-[#0B1220] dark:text-zinc-100"
            aria-invalid={Boolean(form.formState.errors.message)}
            {...form.register("message")}
          />
          <FieldError message={form.formState.errors.message?.message} />
        </div>

        <div className="space-y-2">
          <Label>Delivery</Label>
          <Controller control={form.control} name="deliveryMode" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}><SelectTrigger aria-label="Delivery mode"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Immediate">Immediate</SelectItem><SelectItem value="Scheduled">Scheduled</SelectItem></SelectContent></Select>
          )} />
        </div>
        {deliveryMode === "Scheduled" && <div className="space-y-2"><Label htmlFor="scheduled-at">Schedule time</Label><Input id="scheduled-at" type="datetime-local" {...form.register("scheduledAtLocal")} /><FieldError message={form.formState.errors.scheduledAtLocal?.message} /></div>}
        <div className="space-y-2"><Label htmlFor="expires-at">Expiry (optional)</Label><Input id="expires-at" type="datetime-local" {...form.register("expiresAtLocal")} /><FieldError message={form.formState.errors.expiresAtLocal?.message} /></div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Notification type" className="dark:border-white/10 dark:bg-[#0B1220] dark:text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TYPES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Notification priority" className="dark:border-white/10 dark:bg-[#0B1220] dark:text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_PRIORITIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Target type</Label>
          <Select value={targetType} onValueChange={changeTargetType}>
            <SelectTrigger aria-label="Target type" className="dark:border-white/10 dark:bg-[#0B1220] dark:text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allowedTargets.map((item) => (
                <SelectItem key={item} value={item}>
                  {item.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {targetType !== "All" && (
          <div className="space-y-2">
            <Label>Target</Label>
            {targetOptions.length > 0 ? (
              <Controller
                control={form.control}
                name="targetId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Target" className="dark:border-white/10 dark:bg-[#0B1220] dark:text-zinc-100">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input
                aria-label="Target ID"
                placeholder={
                  targetType === "User"
                    ? "Application User ID"
                    : `${targetType} ID`
                }
                error={Boolean(form.formState.errors.targetId)}
                className="dark:border-white/10 dark:bg-[#0B1220] dark:text-zinc-100"
                {...form.register("targetId")}
              />
            )}
            {needsFreeTextTarget && (
              <p className="text-[12px] text-amber-600 dark:text-amber-400">
                No selectable targets are available. Enter a valid backend ID.
              </p>
            )}
            <FieldError message={form.formState.errors.targetId?.message} />
          </div>
        )}
      </div>

      {receipt && (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-[14px] font-semibold">
              {receipt.wasDuplicate ? "Already sent" : "Notification sent"}
            </p>
            {receipt.status === "Scheduled" && receipt.scheduledAtUtc && <p className="text-[12px]">Scheduled for {new Date(receipt.scheduledAtUtc).toLocaleString()}</p>}
            <p className="text-[12px]">
              {receipt.recipientCount} recipient
              {receipt.recipientCount === 1 ? "" : "s"}
            </p>
          </div>
          {receipt.status === "Scheduled" && <Button type="button" variant="outline" loading={cancelState.isLoading} onClick={async () => { try { await cancelScheduled(receipt.notificationId).unwrap(); setReceipt(null); toast.success("Scheduled notification cancelled"); } catch { toast.error("Scheduled notification could not be cancelled"); } }}>Cancel schedule</Button>}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={sendState.isLoading} loadingText="Sending...">
          <Send />
          Send notification
        </Button>
      </div>
    </form>
  );
}
