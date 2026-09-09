import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { AttendanceForm } from "@/features/attendances/components/AttendanceForm";

export default function CreateAttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Attendance"
        subtitle="Record a student attendance status for a selected date"
        actions={
          <Link href={ROUTES.ATTENDANCES.LIST}>
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Attendance details</CardTitle>
            <CardDescription>
              Choose the student, date, and daily attendance status.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <AttendanceForm redirectOnCreate />
        </CardContent>
      </Card>
    </div>
  );
}
