"use client";

import { BookOpen, TrendingUp, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StudentDashboard() {
  const stats = {
    gradeAverage: 85,
    attendanceRate: 92,
    classesEnrolled: 6,
    rankPercentile: 78,
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="GPA"
          value={stats.gradeAverage}
          icon={<TrendingUp />}
          iconBg="#D1FAE5"
          iconColor="#065F46"
        />
        <StatCard
          label="Attendance"
          value={stats.attendanceRate}
          icon={<Calendar />}
          iconBg="#DBEAFE"
          iconColor="#1E3A8A"
        />
        <StatCard
          label="Classes"
          value={stats.classesEnrolled}
          icon={<BookOpen />}
          iconBg="#FEF3C7"
          iconColor="#B45309"
        />
        <StatCard
          label="Rank Percentile"
          value={stats.rankPercentile}
          icon={<Award />}
          iconBg="#E0E7FF"
          iconColor="#4338CA"
        />
      </div>

      <Card className="border-zinc-200 bg-gradient-to-br from-white to-zinc-50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common student tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button className="w-full" variant="outline">
            My Grades
          </Button>
          <Button className="w-full" variant="outline">
            My Timetable
          </Button>
          <Button className="w-full" variant="outline">
            My Attendance
          </Button>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
          <CardDescription>
            Your academic standing and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-600">Performance Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Current GPA</span>
                  <span className="font-semibold text-green-600">{stats.gradeAverage}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Attendance Rate</span>
                  <span className="font-semibold text-blue-600">{stats.attendanceRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Classes Enrolled</span>
                  <span className="font-semibold text-amber-600">{stats.classesEnrolled}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-600">Academic Standing</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Rank Percentile</span>
                  <span className="font-semibold text-purple-600">Top {stats.rankPercentile}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span className="font-semibold text-emerald-600">Excellent</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trend</span>
                  <span className="font-semibold text-green-600">↑ Improving</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
