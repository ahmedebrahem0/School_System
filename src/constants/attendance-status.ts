// constants/attendance-status.ts

// Attendance status constants
// Used in forms, tables, badges, and filters

export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
} as const;

// Type derived from ATTENDANCE_STATUS constant
export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

// All statuses as array
// Used in filter dropdowns and form selects
export const ALL_ATTENDANCE_STATUSES = Object.values(ATTENDANCE_STATUS);

// Status metadata
// Used in StatusBadge and AttendanceTable
export const ATTENDANCE_STATUS_META = {
  [ATTENDANCE_STATUS.PRESENT]: {
    label: "Present",
    color: "bg-emerald-100 text-emerald-700",
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    label: "Absent",
    color: "bg-red-100 text-red-700",
  },
  [ATTENDANCE_STATUS.LATE]: {
    label: "Late",
    color: "bg-amber-100 text-amber-700",
  },
} as const;