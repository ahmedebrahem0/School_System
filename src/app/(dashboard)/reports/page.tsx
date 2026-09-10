"use client";

import { useState } from "react";
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          <AttendanceReport />
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <GradeReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
