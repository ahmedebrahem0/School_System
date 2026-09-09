// app/(dashboard)/teachers/[id]/page.tsx

"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Edit2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import { TeacherForm } from "@/features/teachers/components/TeacherForm";
import { useTeacher } from "@/features/teachers/hooks/useTeacher";
import { ROUTES } from "@/constants/routes";

export default function TeacherDetailPage() {
  const params = useParams<{ id: string }>();
  const teacherId = Number(params.id);
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "";
  const [showEditForm, setShowEditForm] = useState(isEditMode);

  const { teacher, isLoading, isError, refetch } = useTeacher(teacherId);

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        title="Failed to load teacher"
        description="An error occurred while fetching teacher details."
        onRetry={refetch}
      />
    );

  if (!teacher)
    return (
      <EmptyState
        title="Teacher not found"
        description="The teacher you're looking for doesn't exist or has been deleted."
      />
    );

  const teacherName = teacher.teacherName ?? "Unnamed teacher";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.TEACHERS.LIST}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <PageHeader
            title={teacherName}
            subtitle={`Teacher ID: ${teacher.teacherId}`}
          />
        </div>

        {!showEditForm && (
          <Button
            onClick={() => setShowEditForm(true)}
            variant="outline"
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {showEditForm ? (
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">
              Edit Teacher
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditForm(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          <TeacherForm
            mode="update"
            teacherId={teacher.teacherId}
            initialData={{
              name: teacherName,
            }}
            onSuccess={() => {
              setShowEditForm(false);
              refetch();
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
            <h3 className="font-semibold text-zinc-900">
              Teacher Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-zinc-500">
                  Name
                </p>
                <p className="mt-1 text-[14px] font-medium text-zinc-900">
                  {teacherName}
                </p>
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-wide text-zinc-500">
                  Teacher ID
                </p>
                <p className="mt-1 text-[14px] font-medium text-zinc-900">
                  {teacher.teacherId}
                </p>
              </div>
            </div>
          </div>

          {teacher.subjects.length > 0 && (
            <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold text-zinc-900">Subjects</h3>
              <div className="space-y-2">
                {teacher.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="border-b border-zinc-100 py-2 text-[14px] text-zinc-600 last:border-b-0"
                  >
                    {subject.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {teacher.classes.length > 0 && (
            <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold text-zinc-900">Classes</h3>
              <div className="space-y-2">
                {teacher.classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="border-b border-zinc-100 py-2 text-[14px] text-zinc-600 last:border-b-0"
                  >
                    {cls.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

