"use client";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { ATTENDANCE_STATUS, type AttendanceStatus } from "@/constants/attendance-status";

interface AttendanceBadgeProps {
  status: AttendanceStatus | null;
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  [ATTENDANCE_STATUS.PRESENT]: {
    label: "Present",
    variant: "present",
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    label: "Absent",
    variant: "absent",
  },
  [ATTENDANCE_STATUS.LATE]: {
    label: "Late",
    variant: "late",
  },
};

export function AttendanceBadge({ status }: AttendanceBadgeProps) {
  const config = status
    ? statusConfig[status] ?? {
        label: status,
        variant: "default" as BadgeProps["variant"],
      }
    : {
        label: "Not recorded",
        variant: "default" as BadgeProps["variant"],
      };

  return (
    <Badge variant={config.variant} dot={Boolean(status)}>
      {config.label}
    </Badge>
  );
}
