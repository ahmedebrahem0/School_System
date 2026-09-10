"use client";

import { Users, GraduationCap, BookOpen, School, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import { useGetAdminUsersQuery } from "@/features/admin/api";
import { useGetStudentsQuery } from "@/features/students/api";
import { useGetTeachersQuery } from "@/features/teachers/api";
import { useGetClassesQuery } from "@/features/classes/api";
import { useGetSubjectsQuery } from "@/features/subjects/api";
import { ROLES } from "@/constants/roles";

export function AdminDashboard() {
  const { data: users = [] } = useGetAdminUsersQuery();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: teachers = [] } = useGetTeachersQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();

  const hasUsers = users.length > 0;
  const getRoleCount = (role: typeof ROLES[keyof typeof ROLES]) =>
    users.filter((u) => (u.roles ?? []).includes(role)).length;

  const stats = {
    totalUsers: users.length,
    admins: getRoleCount(ROLES.ADMIN),
    teachers: getRoleCount(ROLES.TEACHER),
    students: getRoleCount(ROLES.STUDENT),
    classes: classes.length,
    subjects: subjects.length,
    pending: users.filter((u) => (u.roles ?? []).length === 0).length,
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
          iconBg="#DBEAFE"
          iconColor="#1E3A8A"
        />
        <StatCard
          label="Admins"
          value={stats.admins}
          icon={<Users />}
          iconBg="#E0E7FF"
          iconColor="#4338CA"
        />
        <StatCard
          label="Teachers"
          value={stats.teachers}
          icon={<BookOpen />}
          iconBg="#CCFBF1"
          iconColor="#0F766E"
        />
        <StatCard
          label="Students"
          value={stats.students}
          icon={<GraduationCap />}
          iconBg="#DBEAFE"
          iconColor="#2563EB"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Classes"
          value={stats.classes}
          icon={<School />}
          iconBg="#F3E8FF"
          iconColor="#6B21A8"
        />
        <StatCard
          label="Subjects"
          value={stats.subjects}
          icon={<BookOpen />}
          iconBg="#FEF3C7"
          iconColor="#B45309"
        />
        <StatCard
          label="Pending Roles"
          value={stats.pending}
          icon={<BarChart3 />}
          iconBg="#FECACA"
          iconColor="#991B1B"
        />
      </div>

      <Card className="border-zinc-200 bg-gradient-to-br from-white to-zinc-50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common admin tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button className="w-full" variant="outline">
            Manage Users
          </Button>
          <Button className="w-full" variant="outline">
            Assign Roles
          </Button>
          <Button className="w-full" variant="outline">
            View Reports
          </Button>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Key metrics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-600">User Distribution</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Admins</span>
                  <span className="font-semibold text-indigo-600">{hasUsers ? ((stats.admins / stats.totalUsers) * 100).toFixed(1) : "0.0"}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Teachers</span>
                  <span className="font-semibold text-teal-600">{hasUsers ? ((stats.teachers / stats.totalUsers) * 100).toFixed(1) : "0.0"}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Students</span>
                  <span className="font-semibold text-blue-600">{hasUsers ? ((stats.students / stats.totalUsers) * 100).toFixed(1) : "0.0"}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-600">Academic Resources</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Classes</span>
                  <span className="font-semibold">{stats.classes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subjects</span>
                  <span className="font-semibold">{stats.subjects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Student-to-Class Ratio</span>
                  <span className="font-semibold">{stats.classes > 0 ? (stats.students / stats.classes).toFixed(1) : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
