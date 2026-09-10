"use client";

import { Award, BookOpen, Calendar, TrendingUp } from "lucide-react";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { StatsGrid } from "./StatsGrid";
import { useStudentDashboardStats } from "../hooks/useDashboardStats";

export function StudentDashboard() {
  const { stats, isLoading, isError, refetch } = useStudentDashboardStats();

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load dashboard"
        description="Unable to fetch student dashboard data"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-8">
      <StatsGrid
        stats={[
          { label: "Average Grade", value: stats.gradeAverage.toFixed(1), icon: TrendingUp, iconBg: "#D1FAE5", iconColor: "#065F46" },
          { label: "Attendance", value: `${stats.attendanceRate.toFixed(1)}%`, icon: Calendar, iconBg: "#DBEAFE", iconColor: "#1E3A8A" },
          { label: "Timetable Items", value: stats.timetableItems, icon: BookOpen, iconBg: "#FEF3C7", iconColor: "#B45309" },
          { label: "Grade Records", value: stats.totalGrades, icon: Award, iconBg: "#E0E7FF", iconColor: "#4338CA" },
        ]}
      />

      <QuickActions
        description="Common student tasks"
        actions={[
          { label: "My Grades", href: ROUTES.STUDENT.MY_GRADES, icon: TrendingUp },
          { label: "My Attendance", href: ROUTES.STUDENT.MY_ATTENDANCE, icon: Calendar },
          { label: "My Profile", href: ROUTES.STUDENT.MY_PROFILE, icon: Award },
        ]}
      />

      <RecentActivity
        title="Academic Performance"
        description="Your academic standing and progress"
        items={[
          { label: "Current Average", value: `${stats.gradeAverage.toFixed(1)}/100`, tone: "emerald" },
          { label: "Attendance Rate", value: `${stats.attendanceRate.toFixed(1)}%`, tone: "blue" },
          { label: "Timetable Items", value: stats.timetableItems, tone: "amber" },
          { label: "Grade Records", value: stats.totalGrades, tone: "indigo" },
        ]}
      />
    </div>
  );
}
