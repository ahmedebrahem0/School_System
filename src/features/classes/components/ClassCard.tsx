"use client";

import { BookOpen, Edit, Eye, GraduationCap, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import type { Class } from "../types";

interface ClassCardProps {
  classItem: Class;
  onDelete?: (classItem: Class) => void;
}

export function ClassCard({ classItem, onDelete }: ClassCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <div className="bg-[#1E3A8A] px-5 py-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[18px] font-semibold leading-snug">
              {classItem.className}
            </h3>
            <p className="mt-1 font-mono text-[13px] text-white/70">
              ID: {classItem.classId}
            </p>
          </div>
          {classItem.schoolGradeName && (
            <Badge className="border-0 bg-white/15 text-white">
              {classItem.schoolGradeName}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="space-y-5 pt-5">
        <div className="grid grid-cols-3 divide-x divide-zinc-100 rounded-[10px] border border-zinc-200">
          <SummaryItem icon={GraduationCap} value={classItem.students.length} label="Students" />
          <SummaryItem icon={Users} value={classItem.teachers.length} label="Teachers" />
          <SummaryItem icon={BookOpen} value={classItem.subjects.length} label="Subjects" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => router.push(ROUTES.CLASSES.DETAIL(classItem.classId))}
          >
            <Eye />
            View
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`${ROUTES.CLASSES.DETAIL(classItem.classId)}?edit`)}
          >
            <Edit />
            Edit
          </Button>
          <Button
            type="button"
            variant="danger"
            size="icon"
            onClick={() => onDelete?.(classItem)}
            aria-label="Delete class"
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SummaryItemProps {
  icon: typeof GraduationCap;
  value: number;
  label: string;
}

function SummaryItem({ icon: Icon, value, label }: SummaryItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-4 text-center">
      <Icon className="size-4 text-zinc-400" />
      <span className="font-mono text-xl font-bold text-zinc-950">{value}</span>
      <span className="text-[11px] text-zinc-500">{label}</span>
    </div>
  );
}
