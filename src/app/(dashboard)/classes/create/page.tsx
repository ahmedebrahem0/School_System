// app/(dashboard)/classes/create/page.tsx

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { ClassForm } from "@/features/classes/components/ClassForm";
import { ROUTES } from "@/constants/routes";

export default function ClassCreatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.CLASSES.LIST}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <PageHeader title="Create Class" />
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 p-8">
        <ClassForm mode="create" />
      </div>
    </div>
  );
}