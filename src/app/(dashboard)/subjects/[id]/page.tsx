// app/(dashboard)/subjects/[id]/page.tsx

"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Edit2, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import { SubjectForm } from "@/features/subjects/components/SubjectForm";
import { useSubject } from "@/features/subjects/hooks/useSubject";
import { ROUTES } from "@/constants/routes";

export default function SubjectDetailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SubjectDetailContent />
    </Suspense>
  );
}

function SubjectDetailContent() {
  const params = useParams<{ id: string }>();
  const subjectId = Number(params.id);
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "";
  const [showEditForm, setShowEditForm] = useState(isEditMode);

  const { subject, isLoading, isError, refetch } = useSubject(subjectId);

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <ErrorMessage
        title="Failed to load subject"
        description="An error occurred while fetching subject details."
        onRetry={refetch}
      />
    );

  if (!subject)
    return (
      <EmptyState
        title="Subject not found"
        description="The subject you're looking for doesn't exist or has been deleted."
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.SUBJECTS.LIST}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <PageHeader
            title={subject.subjectName}
            subtitle={`Subject ID: ${subject.subjectId}`}
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
            <h3 className="text-lg font-semibold text-zinc-900">Edit Subject</h3>
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

          <SubjectForm
            mode="update"
            subjectId={subject.subjectId}
            initialData={{
              subjectName: subject.subjectName,
            }}
            onSuccess={() => {
              setShowEditForm(false);
              refetch();
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-900">Subject Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                  Name
                </p>
                <p className="text-[14px] font-medium text-zinc-900 mt-1">
                  {subject.subjectName}
                </p>
              </div>

              <div>
                <p className="text-[12px] text-zinc-500 uppercase tracking-wide">
                  Subject ID
                </p>
                <p className="text-[14px] font-medium text-zinc-900 mt-1">
                  {subject.subjectId}
                </p>
              </div>
            </div>
          </div>

          {subject.teachers.length > 0 && (
            <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-4">
              <h3 className="font-semibold text-zinc-900">Teachers</h3>
              <div className="space-y-2">
                {subject.teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="text-[14px] text-zinc-600 py-2 border-b border-zinc-100 last:border-b-0"
                  >
                    {teacher.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {subject.classes.length > 0 && (
            <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-4">
              <h3 className="font-semibold text-zinc-900">Classes</h3>
              <div className="space-y-2">
                {subject.classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="text-[14px] text-zinc-600 py-2 border-b border-zinc-100 last:border-b-0"
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
