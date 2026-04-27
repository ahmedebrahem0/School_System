// features/students/hooks/useStudent.ts

// Single student hook
// Fetches full student details including grades and attendances
// Returns derived data calculated from the student's records

import { useMemo } from "react";
import { useGetStudentQuery } from "../api";
import { getLetterGrade, getGradeStatus } from "@/lib/utils/formatters";
import type { StudentDetails } from "../types";

// ─────────────────────────────────────────────────────
// DERIVED STUDENT STATS
// Calculated from student's grades and attendances
// ─────────────────────────────────────────────────────
interface StudentStats {
  averageGrade: number | null;
  letterGrade: string | null;
  gradeStatus: "Pass" | "Fail" | null;
  attendanceRate: number | null;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN TYPE
// ─────────────────────────────────────────────────────
interface UseStudentReturn {
  student: StudentDetails | undefined;
  stats: StudentStats;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
}

// ─────────────────────────────────────────────────────
// USE STUDENT HOOK
// ─────────────────────────────────────────────────────
export const useStudent = (id: number): UseStudentReturn => {
  const { data: student, isLoading, isFetching, isError, refetch } =
    useGetStudentQuery(id);

  // ─────────────────────────────────────────────────
  // CALCULATE DERIVED STATS
  // useMemo prevents recalculation on every render
  // Only recalculates when student data changes
  // ─────────────────────────────────────────────────
  const stats = useMemo((): StudentStats => {
    if (!student) {
      return {
        averageGrade: null,
        letterGrade: null,
        gradeStatus: null,
        attendanceRate: null,
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
      };
    }

    // Calculate average grade
    const grades = student.grades ?? [];
    const averageGrade =
      grades.length > 0
        ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
        : null;

    // Calculate attendance stats
    const attendances = student.attendances ?? [];
    const totalPresent = attendances.filter(
      (a) => a.status === "Present"
    ).length;
    const totalAbsent = attendances.filter(
      (a) => a.status === "Absent"
    ).length;
    const totalLate = attendances.filter(
      (a) => a.status === "Late"
    ).length;

    // Attendance rate = present / total * 100
    const attendanceRate =
      attendances.length > 0
        ? Math.round((totalPresent / attendances.length) * 100)
        : null;

    return {
      averageGrade: averageGrade
        ? Math.round(averageGrade * 100) / 100
        : null,
      letterGrade: averageGrade ? getLetterGrade(averageGrade) : null,
      gradeStatus: averageGrade ? getGradeStatus(averageGrade) : null,
      attendanceRate,
      totalPresent,
      totalAbsent,
      totalLate,
    };
  }, [student]);

  return {
    student,
    stats,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};