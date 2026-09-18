import { useMemo } from "react";
import { ATTENDANCE_STATUS } from "@/constants/attendance-status";
import { useGetAttendancesQuery } from "@/features/attendances/api";
import { useGetGradesQuery } from "@/features/grades/api";
import type { AttendanceReportStats, GradeReportStats } from "../types";

export function useGradeReport() {
  const query = useGetGradesQuery();

  const stats = useMemo<GradeReportStats>(() => {
    const grades = query.data ?? [];
    const totalGrades = grades.length;

    if (totalGrades === 0) {
      return {
        totalGrades: 0,
        averageGrade: 0,
        highestGrade: 0,
        lowestGrade: 0,
        passingRate: 0,
        topPerformer: "N/A",
        bySubject: [],
      };
    }

    const gradeValues = grades.map((item) => item.grade);
    const highestGrade = Math.max(...gradeValues);
    const lowestGrade = Math.min(...gradeValues);
    const topGrade = grades.find((item) => item.grade === highestGrade);
    const passingCount = grades.filter((item) => item.grade >= 60).length;

    const subjectTotals = new Map<string, { total: number; count: number }>();
    for (const item of grades) {
      const entry = subjectTotals.get(item.subjectName) ?? { total: 0, count: 0 };
      entry.total += item.grade;
      entry.count += 1;
      subjectTotals.set(item.subjectName, entry);
    }
    const bySubject = Array.from(subjectTotals.entries()).map(
      ([subjectName, { total, count }]) => ({
        subjectName,
        average: total / count,
      })
    );

    return {
      totalGrades,
      averageGrade:
        gradeValues.reduce((total, value) => total + value, 0) / totalGrades,
      highestGrade,
      lowestGrade,
      passingRate: (passingCount / totalGrades) * 100,
      topPerformer: topGrade?.studentName ?? "N/A",
      bySubject,
    };
  }, [query.data]);

  return {
    ...query,
    stats,
  };
}

export function useAttendanceReport() {
  const query = useGetAttendancesQuery();

  const stats = useMemo<AttendanceReportStats>(() => {
    const attendances = query.data ?? [];
    const totalRecords = attendances.length;
    const present = attendances.filter(
      (item) => item.status === ATTENDANCE_STATUS.PRESENT
    ).length;
    const absent = attendances.filter(
      (item) => item.status === ATTENDANCE_STATUS.ABSENT
    ).length;
    const late = attendances.filter(
      (item) => item.status === ATTENDANCE_STATUS.LATE
    ).length;

    return {
      totalRecords,
      present,
      absent,
      late,
      presentPercentage: totalRecords > 0 ? (present / totalRecords) * 100 : 0,
      absentPercentage: totalRecords > 0 ? (absent / totalRecords) * 100 : 0,
      latePercentage: totalRecords > 0 ? (late / totalRecords) * 100 : 0,
    };
  }, [query.data]);

  return {
    ...query,
    stats,
  };
}
