"use client";

import { BarChart3, BookOpen, GraduationCap, School, ShieldCheck, Users } from "lucide-react";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { StatsGrid } from "./StatsGrid";
import { useAdminDashboardStats } from "../hooks/useDashboardStats";

export function AdminDashboard() {
  const { stats, isLoading, isError, refetch } = useAdminDashboardStats();

  const hasUsers = stats.totalUsers > 0;
  const percent = (value: number) =>
    hasUsers ? `${((value / stats.totalUsers) * 100).toFixed(1)}%` : "0.0%";

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load dashboard"
        description="Unable to fetch dashboard data"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-8">
      <StatsGrid
        stats={[
          { label: "Total Users", value: stats.totalUsers, icon: Users, iconBg: "#DBEAFE", iconColor: "#1E3A8A" },
          { label: "Admins", value: stats.admins, icon: ShieldCheck, iconBg: "#E0E7FF", iconColor: "#4338CA" },
          { label: "Teachers", value: stats.teachers, icon: BookOpen, iconBg: "#CCFBF1", iconColor: "#0F766E" },
          { label: "Students", value: stats.students, icon: GraduationCap, iconBg: "#DBEAFE", iconColor: "#2563EB" },
        ]}
      />

      <StatsGrid
        columns="three"
        stats={[
          { label: "Classes", value: stats.classes, icon: School, iconBg: "#F3E8FF", iconColor: "#6B21A8" },
          { label: "Subjects", value: stats.subjects, icon: BookOpen, iconBg: "#FEF3C7", iconColor: "#B45309" },
          { label: "Pending Roles", value: stats.pending, icon: BarChart3, iconBg: "#FECACA", iconColor: "#991B1B" },
        ]}
      />

      <QuickActions
        description="Common admin tasks"
        actions={[
          { label: "Manage Users", href: ROUTES.ADMIN.USERS, icon: Users },
          { label: "Assign Roles", href: ROUTES.ADMIN.ROLES, icon: ShieldCheck },
          { label: "View Reports", href: ROUTES.REPORTS, icon: BarChart3 },
        ]}
      />

      <RecentActivity
        title="System Overview"
        description="Key metrics at a glance"
        items={[
          { label: "Admins", value: percent(stats.admins), tone: "indigo" },
          { label: "Teachers", value: percent(stats.teachers), tone: "teal" },
          { label: "Students", value: percent(stats.students), tone: "blue" },
          {
            label: "Student-to-Class Ratio",
            value: stats.classes > 0 ? (stats.students / stats.classes).toFixed(1) : "N/A",
            tone: "emerald",
          },
        ]}
      />
    </div>
  );
}
