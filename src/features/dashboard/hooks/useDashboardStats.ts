import { useMemo } from "react";
import { ATTENDANCE_STATUS } from "@/constants/attendance-status";
import { ROLES } from "@/constants/roles";
import {
  useGetAdminUsersQuery,
  useGetClassesQuery,
  useGetGradesQuery,
  useGetMyGradesQuery,
  useGetMyTeacherClassesQuery,
  useGetMyTeacherSubjectsQuery,
  useGetStudentAttendanceQuery,
  useGetStudentsQuery,
  useGetSubjectsQuery,
  useGetTeachersQuery,
  useGetMyTimetableQuery,
} from "../api";

export function useAdminDashboardStats() {
  const usersQuery = useGetAdminUsersQuery();
  const studentsQuery = useGetStudentsQuery();
  const teachersQuery = useGetTeachersQuery();
  const classesQuery = useGetClassesQuery();
  const subjectsQuery = useGetSubjectsQuery();

  const stats = useMemo(() => {
    const users = usersQuery.data ?? [];
    const roleCount = (role: typeof ROLES[keyof typeof ROLES]) =>
      users.filter((user) => (user.roles ?? []).includes(role)).length;

    return {
      totalUsers: users.length,
      admins: roleCount(ROLES.ADMIN),
      teachers: teachersQuery.data?.length ?? roleCount(ROLES.TEACHER),
      students: studentsQuery.data?.length ?? roleCount(ROLES.STUDENT),
      classes: classesQuery.data?.length ?? 0,
      subjects: subjectsQuery.data?.length ?? 0,
      pending: users.filter((user) => (user.roles ?? []).length === 0).length,
    };
  }, [
    classesQuery.data,
    studentsQuery.data,
    subjectsQuery.data,
    teachersQuery.data,
    usersQuery.data,
  ]);

  return {
    stats,
    isLoading:
      usersQuery.isLoading ||
      studentsQuery.isLoading ||
      teachersQuery.isLoading ||
      classesQuery.isLoading ||
      subjectsQuery.isLoading,
    isError:
      usersQuery.isError ||
      studentsQuery.isError ||
      teachersQuery.isError ||
      classesQuery.isError ||
      subjectsQuery.isError,
    refetch: () => {
      usersQuery.refetch();
      studentsQuery.refetch();
      teachersQuery.refetch();
      classesQuery.refetch();
      subjectsQuery.refetch();
    },
  };
}

export function useTeacherDashboardStats() {
  const classesQuery = useGetMyTeacherClassesQuery();
  const subjectsQuery = useGetMyTeacherSubjectsQuery();
  const gradesQuery = useGetGradesQuery();

  const stats = useMemo(() => {
    const classes = classesQuery.data ?? [];
    const grades = gradesQuery.data ?? [];
    const gradeAverage =
      grades.length > 0
        ? grades.reduce((total, item) => total + item.grade, 0) / grades.length
        : 0;

    return {
      classes: classes.length,
      subjects: subjectsQuery.data?.length ?? 0,
      students: 0,
      avgGrade: gradeAverage,
      gradeRecords: grades.length,
    };
  }, [classesQuery.data, gradesQuery.data, subjectsQuery.data]);

  return {
    stats,
    isLoading:
      classesQuery.isLoading ||
      subjectsQuery.isLoading ||
      gradesQuery.isLoading,
    isError:
      classesQuery.isError ||
      subjectsQuery.isError ||
      gradesQuery.isError,
    refetch: () => {
      classesQuery.refetch();
      subjectsQuery.refetch();
      gradesQuery.refetch();
    },
  };
}

export function useStudentDashboardStats() {
  const gradesQuery = useGetMyGradesQuery();
  const attendanceQuery = useGetStudentAttendanceQuery();
  const timetableQuery = useGetMyTimetableQuery();

  const stats = useMemo(() => {
    const grades = gradesQuery.data ?? [];
    const attendances = attendanceQuery.data?.attendDtoForStudentInfo ?? [];
    const present = attendances.filter(
      (item) => item.status === ATTENDANCE_STATUS.PRESENT
    ).length;

    return {
      gradeAverage:
        grades.length > 0
          ? grades.reduce((total, item) => total + item.grade, 0) / grades.length
          : 0,
      attendanceRate:
        attendances.length > 0 ? (present / attendances.length) * 100 : 0,
      timetableItems: timetableQuery.data?.length ?? 0,
      totalGrades: grades.length,
    };
  }, [attendanceQuery.data, gradesQuery.data, timetableQuery.data]);

  return {
    stats,
    isLoading:
      gradesQuery.isLoading || attendanceQuery.isLoading || timetableQuery.isLoading,
    isError: gradesQuery.isError || attendanceQuery.isError || timetableQuery.isError,
    refetch: () => {
      gradesQuery.refetch();
      attendanceQuery.refetch();
      timetableQuery.refetch();
    },
  };
}
