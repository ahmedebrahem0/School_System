"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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
import { useGetGradeQuery } from "@/features/grades/api";
import { GradeBadge } from "@/features/grades/components/GradeBadge";
import { GradeForm } from "@/features/grades/components/GradeForm";
import { GradeTableSkeleton } from "@/features/grades/components/GradeTable.skeleton";
import { useGradeActions } from "@/features/grades/hooks/useGradeActions";

export default function Page() {
  return (
    <Suspense fallback={<GradeTableSkeleton />}>
      <GradeDetailsContent />
    </Suspense>
  );
}

function GradeDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const gradeId = Number(params.id);
  const isEditMode = searchParams.has("edit");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: grade, isLoading, isError, refetch } = useGetGradeQuery(gradeId, {
    skip: !Number.isFinite(gradeId),
  });
  const { delete: deleteGrade, isDeleting } = useGradeActions();

  const handleDelete = async () => {
    await deleteGrade(gradeId, {
      redirectToList: true,
      onSuccess: () => setConfirmOpen(false),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grade Details"
        subtitle="Review and update a single assessment record"
        actions={
          <Link href={ROUTES.GRADES.LIST}>
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <GradeTableSkeleton />
      ) : isError || !grade ? (
        <ErrorMessage
          title="Grade not found"
          description="This grade record may have been deleted or is unavailable."
          onRetry={refetch}
        />
      ) : isEditMode ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Edit grade</CardTitle>
              <CardDescription>
                Update the student, subject, or score for this record.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <GradeForm
              grade={grade}
              mode="update"
              redirectOnUpdate
              onCancel={() => router.push(ROUTES.GRADES.DETAILS(grade.id))}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{grade.studentName}</CardTitle>
                <CardDescription>{grade.subjectName}</CardDescription>
              </div>
              <GradeBadge grade={grade.grade} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[12px] font-medium uppercase text-zinc-500">
                    Student ID
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-zinc-950">
                    {grade.studentId}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[12px] font-medium uppercase text-zinc-500">
                    Subject ID
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-zinc-950">
                    {grade.subjectId}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[12px] font-medium uppercase text-zinc-500">
                    Status
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-zinc-950">
                    {grade.grade >= 50 ? "Passing" : "Needs support"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`${ROUTES.GRADES.DETAILS(grade.id)}?edit`}>
                  <Button>
                    <Edit className="h-4 w-4" />
                    Edit Grade
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
            title="Delete Grade?"
            description={`Delete ${grade.studentName}'s ${grade.subjectName} grade? This action cannot be undone.`}
            confirmLabel="Delete"
          />
        </>
      )}
    </div>
  );
}

