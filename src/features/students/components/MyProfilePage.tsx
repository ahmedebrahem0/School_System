"use client"

import { Calendar, GraduationCap, Hash, UserRound } from "lucide-react"
import PageHeader from "@/components/common/PageHeader"
import ErrorMessage from "@/components/common/ErrorMessage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AvatarWithInitials } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyProfile } from "../hooks/useMyProfile"
import { formatDateShort } from "@/lib/utils/formatters"

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-[10px]" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-[10px]" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-[10px]" />
    </div>
  )
}

export function MyProfilePage() {
  const { student, isLoading, isError, refetch } = useMyProfile()

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (isError || !student) {
    return (
      <ErrorMessage
        title="Failed to load your profile"
        description="Your student profile could not be fetched right now."
        onRetry={refetch}
      />
    )
  }

  const classLabel =
    student.className ??
    student.class?.className ??
    (student.classId ? `Class ${student.classId}` : "Unassigned")
  const birthDate = student.dateOfBirth ? formatDateShort(student.dateOfBirth) : "N/A"
  const attendanceCount = student.attendances?.length ?? 0
  const gradesCount = student.grades?.length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Dashboard", "My Profile"]}
        title="My Profile"
        description="Your student information and academic summary"
      />

      <Card className="overflow-hidden">
        <div className="bg-[#1E3A8A] px-5 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <AvatarWithInitials
              name={student.name ?? "Student"}
              size="xl"
              color="blue"
              className="ring-2 ring-white/30"
            />
            <div className="min-w-0">
              <h2 className="break-words text-[22px] font-[700] leading-tight text-white">
                {student.name ?? "Unnamed student"}
              </h2>
              <p className="mt-1 font-mono text-[13px] text-white/70">
                Student ID: {student.studentId}
              </p>
              <Badge className="mt-3 border-0 bg-white/15 text-white" variant="student">
                {classLabel}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#DBEAFE] text-[#1E3A8A]">
              <GraduationCap size={18} />
            </span>
            <div>
              <p className="text-[12px] text-zinc-500">Class</p>
              <p className="text-[15px] font-[600] text-zinc-950">{classLabel}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-emerald-100 text-emerald-700">
              <Calendar size={18} />
            </span>
            <div>
              <p className="text-[12px] text-zinc-500">Attendance records</p>
              <p className="font-mono text-[18px] font-[700] text-zinc-950">
                {attendanceCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-amber-100 text-amber-700">
              <Hash size={18} />
            </span>
            <div>
              <p className="text-[12px] text-zinc-500">Grade entries</p>
              <p className="font-mono text-[18px] font-[700] text-zinc-950">
                {gradesCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[8px] border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-[12px] font-[600] uppercase text-zinc-500">
                <UserRound size={14} />
                Name
              </div>
              <p className="mt-2 text-[14px] font-[500] text-zinc-900">
                {student.name ?? "N/A"}
              </p>
            </div>
            <div className="rounded-[8px] border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-[12px] font-[600] uppercase text-zinc-500">
                <Calendar size={14} />
                Date of Birth
              </div>
              <p className="mt-2 font-mono text-[14px] text-zinc-900">{birthDate}</p>
            </div>
            <div className="rounded-[8px] border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-[12px] font-[600] uppercase text-zinc-500">
                <GraduationCap size={14} />
                Class
              </div>
              <p className="mt-2 text-[14px] font-[500] text-zinc-900">{classLabel}</p>
            </div>
            <div className="rounded-[8px] border border-zinc-100 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-[12px] font-[600] uppercase text-zinc-500">
                <Hash size={14} />
                Application User
              </div>
              <p className="mt-2 break-all font-mono text-[13px] text-zinc-700">
                {student.applicationUserId ?? "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
