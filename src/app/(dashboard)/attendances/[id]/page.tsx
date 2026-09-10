"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Edit, Trash2 } from "lucide-react";
import { Suspense, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ErrorMessage from "@/components/common/ErrorMessage";
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
import { useGetAttendanceQuery } from "@/features/attendances/api";
import { AttendanceBadge } from "@/features/attendances/components/AttendanceBadge";
import { AttendanceForm } from "@/features/attendances/components/AttendanceForm";
import { AttendanceTableSkeleton } from "@/features/attendances/components/AttendanceTable.skeleton";
import { useAttendanceActions } from "@/features/attendances/hooks/useAttendanceActions";
import { formatDateShort } from "@/lib/utils/formatters";

export default function Page() {
  return (
    <Suspense fallback={<AttendanceTableSkeleton />}>
      <AttendanceDetailsContent />
    </Suspense>
  );
}

function AttendanceDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const attendanceId = Number(params.id);
  const isEditMode = searchParams.has("edit");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: attendance, isLoading, isError, refetch } =
    useGetAttendanceQuery(attendanceId, {
      skip: !Number.isFinite(attendanceId),
    });
  const { delete: deleteAttendance, isDeleting } = useAttendanceActions();

  const handleDelete = async () => {
    await deleteAttendance(attendanceId, {
      redirectToList: true,
      onSuccess: () => setConfirmOpen(false),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Details"
        subtitle="Review and update a single attendance record"
        actions={
          <Link href={ROUTES.ATTENDANCES.LIST}>
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <AttendanceTableSkeleton />
      ) : isError || !attendance ? (
        <ErrorMessage
          title="Attendance not found"
          description="This attendance record may have been deleted or is unavailable."
          onRetry={refetch}
        />
      ) : isEditMode ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Edit attendance</CardTitle>
              <CardDescription>
                Update the student, date, or attendance status for this record.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AttendanceForm
              attendance={attendance}
              mode="update"
              redirectOnUpdate
              onCancel={() =>
                router.push(ROUTES.ATTENDANCES.DETAILS(attendance.attendanceId))
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{attendance.studentName ?? "Unknown student"}</CardTitle>
                <CardDescription>
                  Attendance record #{attendance.attendanceId}
                </CardDescription>
              </div>
              <AttendanceBadge status={attendance.status} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[12px] font-medium uppercase text-zinc-500">
                    Student ID
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-zinc-950">
                    {attendance.studentId}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[12px] font-medium uppercase text-zinc-500">
                    Date
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[18px] font-semibold text-zinc-950">
                    <CalendarDays className="h-4 w-4 text-zinc-500" />
                    {formatDateShort(attendance.date)}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[12px] font-medium uppercase text-zinc-500">
                    Status
                  </p>
                  <div className="mt-2">
                    <AttendanceBadge status={attendance.status} />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={ROUTES.ATTENDANCES.EDIT(attendance.attendanceId)}>
                  <Button>
                    <Edit className="h-4 w-4" />
                    Edit Attendance
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => setConfirmOpen(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConfirmDialog
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Delete Attendance?"
            description={`Delete ${
              attendance.studentName ?? "this student"
            }'s attendance record? This action cannot be undone.`}
            confirmLabel="Delete"
          />
        </>
      )}
    </div>
  );
}
