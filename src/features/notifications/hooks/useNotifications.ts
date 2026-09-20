// features/notifications/hooks/useNotifications.ts

// Derives a notification feed from data the app already fetches —
// there is no backend notifications endpoint, so this diffs the
// current grades/attendance records against the set of ids seen on
// a previous visit (persisted to localStorage) and surfaces new ones.
// This is a client-side, per-browser feed, not a synced server feed.

import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROLES } from "@/constants/roles";
import { useGetGradesQuery } from "@/features/grades/api";
import { useGetAttendancesQuery } from "@/features/attendances/api";
import { useGetMyGradesQuery } from "@/features/grades/api";
import { useGetStudentAttendanceQuery } from "@/features/students/api";
import type { NotificationItem } from "../types";

const STORAGE_KEY = "notifications-seen-ids";
const MAX_ITEMS = 20;

function readSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore write failures (private mode, blocked storage, etc.)
  }
}

export function useNotifications() {
  const { user } = useAuth();
  const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;
  const isStudent = user?.role === ROLES.STUDENT;

  const { data: allGrades } = useGetGradesQuery(undefined, { skip: !isStaff });
  const { data: allAttendances } = useGetAttendancesQuery(undefined, { skip: !isStaff });
  const { data: myGrades } = useGetMyGradesQuery(undefined, { skip: !isStudent });
  const { data: myAttendance } = useGetStudentAttendanceQuery(undefined, { skip: !isStudent });

  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSeenIds(readSeenIds());
    setHydrated(true);
  }, []);

  const allItems = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];

    if (isStaff) {
      for (const grade of allGrades ?? []) {
        items.push({
          id: `grade-${grade.id}`,
          title: "New grade recorded",
          description: `${grade.studentName} — ${grade.subjectName}: ${grade.grade}`,
          createdAt: "",
        });
      }
      for (const attendance of allAttendances ?? []) {
        items.push({
          id: `attendance-${attendance.attendanceId}`,
          title: "New attendance recorded",
          description: `${attendance.studentName ?? "Student"} — ${attendance.status ?? "Unknown"} on ${attendance.date ?? "unknown date"}`,
          createdAt: attendance.date ?? "",
        });
      }
    }

    if (isStudent) {
      for (const grade of myGrades ?? []) {
        items.push({
          id: `mygrade-${grade.id}`,
          title: "New grade posted",
          description: `${grade.subjectName}: ${grade.grade}`,
          createdAt: "",
        });
      }
      for (const record of myAttendance?.attendDtoForStudentInfo ?? []) {
        if (!record.attendanceId) continue;
        items.push({
          id: `myattendance-${record.attendanceId}`,
          title: "Attendance updated",
          description: `${record.subjectName ?? record.className ?? "Class"} — ${record.status ?? "Unknown"} on ${record.date ?? "unknown date"}`,
          createdAt: record.date ?? "",
        });
      }
    }

    return items;
  }, [isStaff, isStudent, allGrades, allAttendances, myGrades, myAttendance]);

  const newItems = useMemo(() => {
    if (!hydrated) return [];
    return allItems.filter((item) => !seenIds.has(item.id)).slice(0, MAX_ITEMS);
  }, [allItems, seenIds, hydrated]);

  const markAllRead = useCallback(() => {
    const nextSeen = new Set(seenIds);
    for (const item of allItems) nextSeen.add(item.id);
    setSeenIds(nextSeen);
    writeSeenIds(nextSeen);
  }, [allItems, seenIds]);

  return {
    notifications: newItems,
    unreadCount: newItems.length,
    markAllRead,
  };
}
