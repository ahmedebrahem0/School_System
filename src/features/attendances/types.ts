import type { AttendanceStatus } from "@/constants/attendance-status";

export interface Attendance {
  attendanceId: number;
  studentId: number;
  studentName: string | null;
  date: string | null;
  status: AttendanceStatus | null;
}

export interface CreateAttendanceDto {
  studentId: number;
  date: string;
  status: AttendanceStatus;
}

export interface UpdateAttendanceDto {
  studentId: number;
  date: string;
  status: AttendanceStatus;
}

export type AttendanceFormData = CreateAttendanceDto;
