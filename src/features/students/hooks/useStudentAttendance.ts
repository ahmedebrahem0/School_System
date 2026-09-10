import { useMemo } from "react";
import { useGetStudentAttendanceQuery } from "../api";
import type { StudentAttendanceRecord } from "../types";

export interface StudentAttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalRecords: number;
  attendanceRate: number | null;
}

interface UseStudentAttendanceOptions {
  studentName?: string;
}

export const useStudentAttendance = (
  options: UseStudentAttendanceOptions = {}
) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetStudentAttendanceQuery(
      options.studentName ? { studentName: options.studentName } : undefined,
      { refetchOnMountOrArgChange: true }
    );

  const records = useMemo<StudentAttendanceRecord[]>(
    () => data?.attendDtoForStudentInfo ?? [],
    [data]
  );

  const stats = useMemo<StudentAttendanceStats>(() => {
    const totalPresent = records.filter((item) => item.status === "Present").length;
    const totalAbsent = records.filter((item) => item.status === "Absent").length;
    const totalLate = records.filter((item) => item.status === "Late").length;
    const totalRecords = records.length;

    return {
      totalPresent,
      totalAbsent,
      totalLate,
      totalRecords,
      attendanceRate:
        totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : null,
    };
  }, [records]);

  return {
    name: data?.name ?? options.studentName ?? null,
    records,
    stats,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};
