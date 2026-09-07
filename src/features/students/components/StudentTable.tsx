"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  X,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AvatarWithInitials } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { useStudents } from "../hooks/useStudents"
import { useStudentActions } from "../hooks/useStudentActions"
import { formatDateShort } from "@/lib/utils/formatters"
import { ROUTES } from "@/constants/routes"
import type { Student } from "../types"

const PAGE_SIZE = 10

// ─── Avatar color by studentId ────────────────────────────────────────────────
const AVATAR_COLORS = ["blue", "teal", "indigo", "emerald", "amber"] as const
function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

export function StudentTable() {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)

  const {
    students,
    total,
    totalPages,
    page,
    setPage,
    search,
    classFilter,
    hasActiveFilters,
    handleSearch,
    handleClassFilter,
    clearFilters,
    isLoading,
    isFetching,
    allStudents,
  } = useStudents({ pageSize: PAGE_SIZE })

  const { handleDelete, isDeleting } = useStudentActions()

  // ── Unique classes for filter dropdown ───────────────────────────────────
  const uniqueClasses = Array.from(
    new Map(
      allStudents
        .filter((s) => s.classId !== null)
        .map((s) => [s.classId, s.classId])
    ).values()
  )

  // ── Handlers ─────────────────────────────────────────────────────────────
  const onConfirmDelete = async () => {
    if (!deleteTarget) return
    await handleDelete(deleteTarget.studentId, deleteTarget.name, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const startIndex = (page - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(page * PAGE_SIZE, total)

  return (
    <>
      <div className="bg-white rounded-[10px] border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* ── Filter Bar ─────────────────────────────────────────────────── */}
        <div className="p-4 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-[280px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              size={15}
            />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {/* Class filter */}
          <Select
            value={classFilter !== null ? String(classFilter) : "all"}
            onValueChange={(val) =>
              handleClassFilter(val === "all" ? null : Number(val))
            }
          >
            <SelectTrigger className="w-[160px] h-10">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map((classId) => (
                <SelectItem key={classId} value={String(classId)}>
                  Class {classId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Active filters count + clear */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-zinc-500 hover:text-zinc-700"
            >
              <X size={14} />
              Clear filters
            </Button>
          )}

          {/* Fetching indicator */}
          {isFetching && !isLoading && (
            <span className="ml-auto text-[12px] text-zinc-400 animate-pulse">
              Updating...
            </span>
          )}
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-0 border-0">
                  <EmptyState
                    icon={<GraduationCap size={32} className="text-zinc-300" />}
                    title="No students found"
                    description={
                      hasActiveFilters
                        ? "No students match your current filters."
                        : "No students have been added yet."
                    }
                    action={
                      hasActiveFilters
                        ? { label: "Clear filters", onClick: clearFilters }
                        : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <TableRow key={student.studentId}>
                  {/* # */}
                  <TableCell>
                    <span className="text-[13px] text-zinc-400 font-mono">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </span>
                  </TableCell>

                  {/* Student Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AvatarWithInitials
                        name={student.name}
                        size="sm"
                        color={getAvatarColor(student.studentId)}
                      />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-[500] text-zinc-900 leading-snug">
                          {student.name}
                        </span>
                        <span className="text-[12px] text-zinc-400 font-mono">
                          ID: {student.studentId}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Date of Birth */}
                  <TableCell>
                    <span className="text-[13px] text-zinc-600 font-mono">
                      {student.dateOfBirth
                        ? formatDateShort(student.dateOfBirth)
                        : "—"}
                    </span>
                  </TableCell>

                  {/* Class */}
                  <TableCell>
                    {student.classId ? (
                      <Badge variant="primary">
                        Class {student.classId}
                      </Badge>
                    ) : (
                      <span className="text-[13px] text-zinc-400">—</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          router.push(ROUTES.STUDENTS.DETAILS(student.studentId))
                        }
                        aria-label={`View ${student.name}`}
                        className="text-zinc-400 hover:text-zinc-700"
                      >
                        <Eye size={15} />
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          router.push(ROUTES.STUDENTS.DETAILS(student.studentId))
                        }
                        aria-label={`Edit ${student.name}`}
                        className="text-zinc-400 hover:text-[#1E3A8A]"
                      >
                        <Pencil size={15} />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(student)}
                        aria-label={`Delete ${student.name}`}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100">
            {/* Info */}
            <span className="text-[13px] text-zinc-500">
              Showing {startIndex}–{endIndex} of {total} students
            </span>

            {/* Pages */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) {
                    acc.push("...")
                  }
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1.5 text-[13px] text-zinc-400"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "ghost"}
                      size="icon-sm"
                      onClick={() => setPage(p as number)}
                      aria-label={`Page ${p}`}
                      aria-current={p === page ? "page" : undefined}
                      className={
                        p !== page ? "text-zinc-600 hover:text-zinc-900" : ""
                      }
                    >
                      {p}
                    </Button>
                  )
                )}

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Confirm Delete Dialog ─────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name ?? "Student"}?`}
        description="This action cannot be undone. All data for this student will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}
