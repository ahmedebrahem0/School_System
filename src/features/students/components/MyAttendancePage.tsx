"use client"

import type { ReactNode } from "react"
import { CalendarCheck, Clock, ListChecks, XCircle } from "lucide-react"
import PageHeader from "@/components/common/PageHeader"
import ErrorMessage from "@/components/common/ErrorMessage"
import EmptyState from "@/components/common/EmptyState"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStudentAttendance } from "../hooks/useStudentAttendance"
import { formatDateShort } from "@/lib/utils/formatters"

const statusVariant: Record<string, BadgeProps["variant"]> = {
  Present: "present",
  Absent: "absent",
  Late: "late",
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-[10px]" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-[10px]" />
    </div>
  )
}

export function MyAttendancePage() {
  const { name, records, stats, isLoading, isError, isFetching, refetch } =
    useStudentAttendance()

  if (isLoading) {
    return <AttendanceSkeleton />
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load attendance"
        description="Your attendance records could not be fetched right now."
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Dashboard", "My Attendance"]}
        title="My Attendance"
        description={name ? `Attendance records for ${name}` : "Your attendance records"}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Attendance rate"
          value={stats.attendanceRate !== null ? `${stats.attendanceRate}%` : "N/A"}
          icon={<CalendarCheck size={18} />}
          color="blue"
        />
        <SummaryCard
          label="Present"
          value={stats.totalPresent}
          icon={<ListChecks size={18} />}
          color="emerald"
        />
        <SummaryCard
          label="Late"
          value={stats.totalLate}
          icon={<Clock size={18} />}
          color="amber"
        />
        <SummaryCard
          label="Absent"
          value={stats.totalAbsent}
          icon={<XCircle size={18} />}
          color="red"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <div>
            <h2 className="text-[16px] font-[600] text-zinc-950">Records</h2>
            <p className="text-[13px] text-zinc-500">
              {stats.totalRecords} total {stats.totalRecords === 1 ? "entry" : "entries"}
            </p>
          </div>
          {isFetching && (
            <span className="text-[12px] text-zinc-400">Updating...</span>
          )}
        </div>

        {records.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck size={32} className="text-zinc-300" />}
            title="No attendance records"
            description="Your attendance history has not been recorded yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => {
                  const status = record.status ?? "N/A"

                  return (
                    <TableRow key={record.attendanceId ?? `${record.date}-${index}`}>
                      <TableCell className="font-mono text-[13px] text-zinc-700">
                        {record.date ? formatDateShort(record.date) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariant[status] ?? "default"}
                          dot={status !== "N/A"}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[13px] text-zinc-600">
                        {record.className ?? "N/A"}
                      </TableCell>
                      <TableCell className="text-[13px] text-zinc-600">
                        {record.subjectName ?? "N/A"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string | number
  icon: ReactNode
  color: "blue" | "emerald" | "amber" | "red"
}) {
  const colorClass = {
    blue: "bg-[#DBEAFE] text-[#1E3A8A]",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  }[color]

  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-5">
        <span className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${colorClass}`}>
          {icon}
        </span>
        <div>
          <p className="text-[12px] text-zinc-500">{label}</p>
          <p className="font-mono text-[20px] font-[700] text-zinc-950">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
