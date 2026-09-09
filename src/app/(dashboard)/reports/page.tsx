"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceReport } from "@/features/reports/components/AttendanceReport";
import { GradeReport } from "@/features/reports/components/GradeReport";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="View detailed analytics and performance reports"
      />

      <Card>
        <CardHeader>
          <CardTitle>Report Analytics</CardTitle>
          <CardDescription>
            Select a report type to view detailed analytics and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="space-y-6 mt-6">
              <AttendanceReport />
            </TabsContent>

            <TabsContent value="grades" className="space-y-6 mt-6">
              <GradeReport />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
