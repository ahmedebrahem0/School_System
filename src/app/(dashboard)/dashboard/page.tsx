"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { AdminDashboard } from "@/features/dashboard/components/AdminDashboard";
import { TeacherDashboard } from "@/features/dashboard/components/TeacherDashboard";
import { StudentDashboard } from "@/features/dashboard/components/StudentDashboard";
import PageHeader from "@/components/common/PageHeader";
import { ROLES } from "@/constants/roles";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

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
