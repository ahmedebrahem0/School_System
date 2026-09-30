"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { AdminDashboard } from "@/features/dashboard/components/AdminDashboard";
import { TeacherDashboard } from "@/features/dashboard/components/TeacherDashboard";
import { StudentDashboard } from "@/features/dashboard/components/StudentDashboard";
import PageHeader from "@/components/common/PageHeader";
import { ROLES } from "@/constants/roles";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  // The role dashboard renders its own complete loading state. Avoid showing a
  // smaller, unrelated four-card placeholder while auth hydrates first.
  if (isLoading || !user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user.fullName || user.userName}`}
        subtitle="Your personalized dashboard with all important information"
      />

      {user.role === ROLES.ADMIN && <AdminDashboard />}
      {user.role === ROLES.TEACHER && <TeacherDashboard />}
      {user.role === ROLES.STUDENT && <StudentDashboard />}
    </div>
  );
}
