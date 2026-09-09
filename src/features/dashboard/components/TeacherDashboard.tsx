"use client";

import { BookOpen, Users, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetTeachersQuery } from "@/features/teachers/api";
import { useGetClassesQuery } from "@/features/classes/api";
import { useGetSubjectsQuery } from "@/features/subjects/api";

export function TeacherDashboard() {
  const { data: teachers = [] } = useGetTeachersQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();

  const stats = {
    classes: classes.length,
    subjects: subjects.length,
    students: classes.reduce((sum, c) => sum + (c.students?.length || 0), 0),
    avgGrade: 78,
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="My Classes"
          value={stats.classes}
          icon={<Users />}
          iconBg="#CCFBF1"
          iconColor="#0F766E"
        />
        <StatCard
          label="My Subjects"
          value={stats.subjects}
          icon={<BookOpen />}
          iconBg="#FEF3C7"
          iconColor="#B45309"
        />
        <StatCard
          label="Total Students"
          value={stats.students}
          icon={<Users />}
          iconBg="#DBEAFE"
          iconColor="#2563EB"
        />
        <StatCard
          label="Avg Student Grade"
          value={stats.avgGrade}
          icon={<TrendingUp />}
          iconBg="#D1FAE5"
          iconColor="#065F46"
        />
      </div>

      <Card className="border-zinc-200 bg-gradient-to-br from-white to-zinc-50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common teaching tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button className="w-full" variant="outline">
            My Classes
          </Button>
          <Button className="w-full" variant="outline">
            Record Grades
          </Button>
          <Button className="w-full" variant="outline">
            Mark Attendance
          </Button>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle>Teaching Overview</CardTitle>
          <CardDescription>
            Your teaching load and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-600">Class Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Classes Teaching</span>
                  <span className="font-semibold text-teal-600">{stats.classes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subjects</span>
                  <span className="font-semibold text-amber-600">{stats.subjects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Students</span>
                  <span className="font-semibold text-blue-600">{stats.students}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-600">Performance Metrics</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Avg Class Size</span>
                  <span className="font-semibold">{stats.classes > 0 ? (stats.students / stats.classes).toFixed(1) : "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Grade</span>
                  <span className="font-semibold text-green-600">{stats.avgGrade}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Performance</span>
                  <span className="font-semibold text-emerald-600">Good</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
