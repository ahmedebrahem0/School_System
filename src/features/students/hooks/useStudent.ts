// features/students/hooks/useStudent.ts

// Single student hook with derived statistics
// Fetches full student details including grades and attendance
// Calculates derived stats (averageGrade, attendanceRate, etc.)
// Uses useMemo to avoid recalculating on every render

import { useMemo } from "react";
import { useGetStudentQuery } from "../api";
import { getLetterGrade, getGradeStatus } from "@/lib/utils/formatters";
import type { StudentDetails } from "../types";

// ─────────────────────────────────────────────────────
// DERIVED STUDENT STATISTICS
// Calculated from the student's grades and attendances
// Not stored in database — calculated from raw data
// ─────────────────────────────────────────────────────
export interface StudentStats {
  // Grade Statistics
  averageGrade: number | null;      // Average of all grades (e.g., 87.5)
  letterGrade: string | null;        // Letter grade (A, B, C, D, F)
  gradeStatus: "Pass" | "Fail" | null;  // Pass if >= 50, Fail if < 50

  // Attendance Statistics
  attendanceRate: number | null;    // Percentage (0-100)
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalRecords: number;
}

// ─────────────────────────────────────────────────────
// HOOK RETURN TYPE
// Everything needed to display student detail page
// ─────────────────────────────────────────────────────
interface UseStudentReturn {
  // Raw data from API
  student: StudentDetails | undefined;

  // Calculated statistics
  stats: StudentStats;

  // Loading states
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;

  // Refetch
  refetch: () => void;
}

// ─────────────────────────────────────────────────────
// USE STUDENT HOOK
// ─────────────────────────────────────────────────────
export const useStudent = (id: number): UseStudentReturn => {
  // ─────────────────────────────────────────────────
  // FETCH SINGLE STUDENT
  // Includes full nested data: class, attendances, grades
  // ─────────────────────────────────────────────────
  const { data: student, isLoading, isFetching, isError, refetch } =
    useGetStudentQuery(id);

  // ─────────────────────────────────────────────────
  // CALCULATE DERIVED STATISTICS
  // useMemo prevents recalculation on every render
  // Only recalculates when student data actually changes
  //
  // Calculations:
  //   1. Average grade from all grades
  //   2. Letter grade (A, B, C, D, F)
  //   3. Pass/Fail status
  //   4. Attendance statistics (present, absent, late, rate)
  // ─────────────────────────────────────────────────
  const stats = useMemo((): StudentStats => {
    // If no student data yet, return empty stats
    if (!student) {
      return {
        averageGrade: null,
        letterGrade: null,
        gradeStatus: null,
        attendanceRate: null,
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalRecords: 0,
      };
    }

    // ─────────────────────────────────────────────
    // GRADE STATISTICS
    // ─────────────────────────────────────────────
    const grades = student.grades ?? [];

    // Calculate average grade
    // Example: grades = [90, 85, 92]
    // → sum = 267, length = 3, average = 89
    const averageGrade =
      grades.length > 0
        ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
        : null;

    // Round to 2 decimal places
    // 89.666... → 89.67
    const roundedAverage = averageGrade
      ? Math.round(averageGrade * 100) / 100
      : null;

    // Get letter grade (A, B, C, D, F)
    // Example: 89 → "A"
    const letterGrade = roundedAverage
      ? getLetterGrade(roundedAverage)
      : null;

    // Get pass/fail status
    // Example: 89 → "Pass", 45 → "Fail"
    const gradeStatus = roundedAverage
      ? getGradeStatus(roundedAverage)
      : null;

    // ─────────────────────────────────────────────
    // ATTENDANCE STATISTICS
    // ─────────────────────────────────────────────
    const attendances = student.attendances ?? [];

    // Count by status
    const totalPresent = attendances.filter(
      (a) => a.status === "Present"
    ).length;
    const totalAbsent = attendances.filter(
      (a) => a.status === "Absent"
    ).length;
    const totalLate = attendances.filter(
      (a) => a.status === "Late"
    ).length;
    const totalRecords = attendances.length;

    // Calculate attendance rate
    // Example: 8 present out of 10 records
    // → (8 / 10) * 100 = 80%
    const attendanceRate =
      attendances.length > 0
        ? Math.round((totalPresent / attendances.length) * 100)
        : null;

    return {
      averageGrade: roundedAverage,
      letterGrade,
      gradeStatus,
      attendanceRate,
      totalPresent,
      totalAbsent,
      totalLate,
      totalRecords,
    };
  }, [student]);
  // ↑ Only recalculates when student data changes

  return {
    student,
    stats,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};