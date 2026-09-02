// app/(dashboard)/classes/[id]/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft, Edit2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { EmptyState } from "@/components/common/EmptyState";
import { ClassForm } from "@/features/classes/components/ClassForm";
import { useClass } from "@/features/classes/hooks/useClass";
import { ROUTES } from "@/constants/routes";

interface ClassDetailPageProps {
  params: { id: string };
}

export default function ClassDetailPage({ params }: ClassDetailPageProps) {
  const classId = Number(params.id);
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "";
  const [showEditForm, setShowEditForm] = useState(isEditMode);

  const { class: classData, isLoading, isError, refetch } = useClass(classId);

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        title="Failed to load class"
        description="An error occurred while fetching class details."
        onRetry={refetch}
      />
    );

  if (!classData)
    return (
      <EmptyState
        title="Class not found"
        description="The class you're looking for doesn't exist or has been deleted."
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.CLASSES.LIST}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <PageHeader
            title={classData.className}
            subtitle={`Class ID: ${classData.classId}`}
          />
        </div>

        {!showEditForm && (
          <Button
            onClick={() => setShowEditForm(true)}
            variant="outline"
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        )}
      </div>

      {showEditForm ? (
        <div className="bg-white rounded-lg border border-zinc-200 p-8 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-900">Edit Class</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditForm(false)}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>

          <ClassForm
            mode="update"
            classId={classData.classId}
            initialData={{
              className: classData.className,
            }}
            onSuccess={() => {
              setShowEditForm(false);
              refetch();
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-900">Class Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                Name
              </p>
              <p className="text-[14px] font-medium text-zinc-900 mt-1">
                {classData.className}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                Class ID
              </p>
              <p className="text-[14px] font-medium text-zinc-900 mt-1">
                {classData.classId}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                Students
              </p>
              <p className="text-[14px] font-medium text-zinc-900 mt-1">
                {classData.students.length}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                Teachers
              </p>
              <p className="text-[14px] font-medium text-zinc-900 mt-1">
                {classData.teachers.length}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                Subjects
              </p>
              <p className="text-[14px] font-medium text-zinc-900 mt-1">
                {classData.subjects.length}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                Timetables
              </p>
              <p className="text-[14px] font-medium text-zinc-900 mt-1">
                {classData.timetables.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}