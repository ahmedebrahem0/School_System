// app/(dashboard)/subjects/create/page.tsx

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import { SubjectForm } from "@/features/subjects/components/SubjectForm";
import { ROUTES } from "@/constants/routes";

export default function SubjectCreatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.SUBJECTS.LIST}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <PageHeader title="Create Subject" />
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 p-8">
        <SubjectForm mode="create" />
      </div>
    </div>
  );
}
