"use client";

import { BookOpen, CalendarCheck, TrendingUp, Users } from "lucide-react";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { StatsGrid } from "./StatsGrid";
import { useTeacherDashboardStats } from "../hooks/useDashboardStats";

export function TeacherDashboard() {
  const { stats, isLoading, isError, refetch } = useTeacherDashboardStats();

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load dashboard"
        description="Unable to fetch teacher dashboard data"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-8">
      <StatsGrid
        stats={[
          { label: "Classes", value: stats.classes, icon: Users, iconBg: "#CCFBF1", iconColor: "#0F766E" },
          { label: "Subjects", value: stats.subjects, icon: BookOpen, iconBg: "#FEF3C7", iconColor: "#B45309" },
          { label: "Students", value: stats.students, icon: Users, iconBg: "#DBEAFE", iconColor: "#2563EB" },
          { label: "Average Grade", value: stats.avgGrade.toFixed(1), icon: TrendingUp, iconBg: "#D1FAE5", iconColor: "#065F46" },
        ]}
      />

      <QuickActions
        description="Common teaching tasks"
        actions={[
          { label: "My Classes", href: ROUTES.TEACHER.MY_CLASSES, icon: Users },
          { label: "Record Grades", href: ROUTES.TEACHER.GRADES, icon: TrendingUp },
          { label: "Mark Attendance", href: ROUTES.TEACHER.ATTENDANCES, icon: CalendarCheck },
        ]}
      />

      <RecentActivity
        title="Teaching Overview"
        description="Your teaching load and classroom records"
        items={[
          { label: "Average Class Size", value: stats.classes > 0 ? (stats.students / stats.classes).toFixed(1) : "N/A", tone: "teal" },
          { label: "Grade Records", value: stats.avgGrade > 0 ? `${stats.avgGrade.toFixed(1)}/100` : "N/A", tone: "emerald" },
          { label: "Attendance Records", value: stats.attendanceRecords, tone: "blue" },
          { label: "Subjects", value: stats.subjects, tone: "amber" },
        ]}
      />
    </div>
  );
}
