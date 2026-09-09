import { useRouter } from "next/navigation"
import { Pencil, Trash2, GraduationCap, Calendar, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AvatarWithInitials } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDateShort, getLetterGrade, getGradeColor, getInitials } from "@/lib/utils/formatters"
import { ROUTES } from "@/constants/routes"
import type { StudentDetails } from "../types"

interface StudentCardProps {
  student: StudentDetails
  onDelete?: (student: StudentDetails) => void
}

export function StudentCard({ student, onDelete }: StudentCardProps) {
  const router = useRouter()

  // ── Attendance summary ────────────────────────────────────────────────────
  const attendanceSummary = student.attendances.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const totalAttendance = student.attendances.length
  const presentRate =
    totalAttendance > 0
      ? Math.round(((attendanceSummary.Present ?? 0) / totalAttendance) * 100)
      : null

  // ── Average grade ─────────────────────────────────────────────────────────
  const avgGrade =
    student.grades.length > 0
      ? Math.round(
          student.grades.reduce((sum, g) => sum + g.grade, 0) /
            student.grades.length
        )
      : null

  return (
    <Card className="overflow-hidden">
      {/* ── Top hero section ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1D4ED8] px-5 pt-6 pb-10 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <AvatarWithInitials
              name={student.name}
              size="xl"
              color="blue"
              className="ring-2 ring-white/30 ring-offset-0"
            />
            <div>
              <h2 className="text-[18px] font-[600] text-white leading-snug">
                {student.name}
              </h2>
              <p className="text-[13px] text-white/60 font-mono mt-0.5">
                ID: {student.studentId}
              </p>
              {student.class && (
                <Badge variant="student" className="mt-2 bg-white/15 text-white border-0">
                  {student.class.className}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push(ROUTES.STUDENTS.EDIT(student.studentId))}
              className="text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Edit student"
            >
              <Pencil size={15} />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete?.(student)}
              className="text-white/70 hover:text-red-300 hover:bg-white/10"
              aria-label="Delete student"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="mx-5 -mt-5 mb-0">
        <div className="bg-white rounded-[10px] border border-zinc-200 shadow-sm grid grid-cols-3 divide-x divide-zinc-100">
          {/* Attendance */}
          <div className="px-4 py-3 text-center">
            <p className="text-[20px] font-[700] font-mono text-zinc-950">
              {presentRate !== null ? `${presentRate}%` : "—"}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Attendance</p>
          </div>
          {/* Avg Grade */}
          <div className="px-4 py-3 text-center">
            <p
              className="text-[20px] font-[700] font-mono"
              style={{
                color: avgGrade !== null ? getGradeColor(avgGrade) : "#71717A",
              }}
            >
              {avgGrade !== null ? avgGrade : "—"}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Avg Grade</p>
          </div>
          {/* Subjects */}
          <div className="px-4 py-3 text-center">
            <p className="text-[20px] font-[700] font-mono text-zinc-950">
              {student.grades.length}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Subjects</p>
          </div>
        </div>
      </div>

      <CardContent className="pt-5 space-y-5">
        {/* ── Basic Info ──────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <h3 className="text-[13px] font-[600] uppercase tracking-wide text-zinc-400">
            Information
          </h3>

          <div className="space-y-2.5">
            {/* Date of Birth */}
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-zinc-100 text-zinc-400 flex-shrink-0">
                <Calendar size={13} />
              </span>
              <div>
                <p className="text-[11px] text-zinc-400">Date of Birth</p>
                <p className="text-[14px] text-zinc-700 font-mono">
                  {student.dateOfBirth
                    ? formatDateShort(student.dateOfBirth)
                    : "—"}
                </p>
              </div>
            </div>

            {/* Class */}
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-zinc-100 text-zinc-400 flex-shrink-0">
                <GraduationCap size={13} />
              </span>
              <div>
                <p className="text-[11px] text-zinc-400">Class</p>
                <p className="text-[14px] text-zinc-700">
                  {student.class?.className ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* ── Grades ──────────────────────────────────────────────────────── */}
        {student.grades.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-[600] uppercase tracking-wide text-zinc-400">
                Grades
              </h3>
              <BookOpen size={14} className="text-zinc-300" />
            </div>

            <div className="space-y-2">
              {student.grades.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between py-1.5"
                >
                  <span className="text-[13px] text-zinc-600">
                    {g.subject?.subjectName ?? `Subject ${g.subjectId}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[14px] font-[600] font-mono"
                      style={{ color: getGradeColor(g.grade) }}
                    >
                      {g.grade}
                    </span>
                    <Badge
                      variant={g.grade >= 50 ? "pass" : "fail"}
                      className="text-[11px]"
                    >
                      {getLetterGrade(g.grade)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Attendance ──────────────────────────────────────────────────── */}
        {totalAttendance > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-[13px] font-[600] uppercase tracking-wide text-zinc-400">
                Attendance Summary
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-[8px] bg-emerald-50">
                  <p className="text-[16px] font-[700] text-emerald-600 font-mono">
                    {attendanceSummary.Present ?? 0}
                  </p>
                  <p className="text-[11px] text-emerald-600">Present</p>
                </div>
                <div className="text-center p-2 rounded-[8px] bg-red-50">
                  <p className="text-[16px] font-[700] text-red-500 font-mono">
                    {attendanceSummary.Absent ?? 0}
                  </p>
                  <p className="text-[11px] text-red-500">Absent</p>
                </div>
                <div className="text-center p-2 rounded-[8px] bg-amber-50">
                  <p className="text-[16px] font-[700] text-amber-500 font-mono">
                    {attendanceSummary.Late ?? 0}
                  </p>
                  <p className="text-[11px] text-amber-500">Late</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
