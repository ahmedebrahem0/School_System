import { useMemo } from "react";
import { useStudentAttendance } from "@/features/students/hooks/useStudentAttendance";
import type { StudentAttendanceRecord } from "@/features/students/types";

export interface MyAttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number | null;
}

export const summarizeMyAttendance = (
  records: StudentAttendanceRecord[]
): MyAttendanceSummary => {
  const present = records.filter((record) => record.status === "Present").length;
  const absent = records.filter((record) => record.status === "Absent").length;
  const late = records.filter((record) => record.status === "Late").length;
  const total = records.length;

  return {
    total,
    present,
    absent,
    late,
    attendanceRate: total > 0 ? Math.round((present / total) * 100) : null,
  };
};

export const useMyAttendance = () => {
  const attendance = useStudentAttendance();
  const summary = useMemo(
    () => summarizeMyAttendance(attendance.records),
    [attendance.records]
  );

  return {
    ...attendance,
    summary,
  };
};
