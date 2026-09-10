"use client";

import { BookOpen, Edit, Eye, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { AvatarWithInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import type { Teacher } from "../types";

interface TeacherCardProps {
  teacher: Teacher;
  onDelete?: (teacher: Teacher) => void;
}

export function TeacherCard({ teacher, onDelete }: TeacherCardProps) {
  const router = useRouter();
  const teacherName = teacher.teacherName ?? "Unnamed teacher";

  return (
    <Card className="overflow-hidden">
      <div className="bg-[#0F766E] px-5 py-5 text-white">
        <div className="flex items-center gap-4">
          <AvatarWithInitials
            name={teacherName}
            size="xl"
            color="teal"
            className="ring-2 ring-white/30"
          />
          <div className="min-w-0">
            <h3 className="truncate text-[18px] font-semibold leading-snug">
              {teacherName}
            </h3>
            <p className="mt-1 font-mono text-[13px] text-white/70">
              ID: {teacher.teacherId}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-5 pt-5">
        <div className="grid grid-cols-2 divide-x divide-zinc-100 rounded-[10px] border border-zinc-200">
          <div className="flex flex-col items-center gap-1 px-3 py-4 text-center">
            <BookOpen className="size-4 text-amber-500" />
            <span className="font-mono text-xl font-bold text-zinc-950">
              {teacher.subjects.length}
            </span>
            <span className="text-[11px] text-zinc-500">Subjects</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-3 py-4 text-center">
            <Users className="size-4 text-blue-500" />
            <span className="font-mono text-xl font-bold text-zinc-950">
              {teacher.classes.length}
            </span>
            <span className="text-[11px] text-zinc-500">Classes</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {teacher.subjects.slice(0, 3).map((subject) => (
            <Badge key={subject.id} variant="warning">
              {subject.name}
            </Badge>
          ))}
          {teacher.subjects.length > 3 && (
            <Badge variant="default">+{teacher.subjects.length - 3}</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => router.push(ROUTES.TEACHERS.DETAILS(teacher.teacherId))}
          >
            <Eye />
            View
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`${ROUTES.TEACHERS.DETAILS(teacher.teacherId)}?edit`)}
          >
            <Edit />
            Edit
          </Button>
          <Button
            type="button"
            variant="danger"
            size="icon"
            onClick={() => onDelete?.(teacher)}
            aria-label="Delete teacher"
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
