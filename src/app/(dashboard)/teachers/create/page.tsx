// app/(dashboard)/teachers/create/page.tsx

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import { TeacherForm } from "@/features/teachers/components/TeacherForm";
import { ROUTES } from "@/constants/routes";

export default function TeacherCreatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.TEACHERS.LIST}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <PageHeader title="Create Teacher" />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-8">
        <TeacherForm mode="create" />
      </div>
    </div>
  );
}

