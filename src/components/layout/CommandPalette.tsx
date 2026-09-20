// components/layout/CommandPalette.tsx

// Command palette (Ctrl/Cmd+K) — quick navigation to nav pages plus
// fuzzy-ish search over students and teachers, reusing the same data
// GlobalSearch uses.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { GraduationCap, Search, Users } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGetStudentsQuery } from "@/features/students/api";
import { useGetTeachersQuery } from "@/features/teachers/api";
import { canAccess } from "@/lib/utils/permissions";
import { NAV_CONFIG } from "@/constants/nav-config";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const MAX_RESULTS_PER_GROUP = 5;

export function CommandPalette() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const canSearchStudents = !!user && canAccess(user.role, "students");
  const canSearchTeachers = !!user && canAccess(user.role, "teachers");

  const { data: students = [] } = useGetStudentsQuery(undefined, {
    skip: !canSearchStudents || !open,
  });
  const { data: teachers = [] } = useGetTeachersQuery(undefined, {
    skip: !canSearchTeachers || !open,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const term = query.trim().toLowerCase();

  const navPages = useMemo(() => {
    if (!user) return [];
    const sections = NAV_CONFIG[user.role] ?? [];
    const items = sections.flatMap((section) => section.items);
    if (!term) return items;
    return items.filter((item) => item.label.toLowerCase().includes(term));
  }, [user, term]);

  const matchedStudents = useMemo(() => {
    if (!term) return [];
    return students
      .filter((s) => s.name.toLowerCase().includes(term))
      .slice(0, MAX_RESULTS_PER_GROUP);
  }, [students, term]);

  const matchedTeachers = useMemo(() => {
    if (!term) return [];
    return teachers
      .filter((t) => (t.teacherName ?? "").toLowerCase().includes(term))
      .slice(0, MAX_RESULTS_PER_GROUP);
  }, [teachers, term]);

  const goTo = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const hasAnyResults =
    navPages.length > 0 || matchedStudents.length > 0 || matchedTeachers.length > 0;

  if (!user) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2",
            "bg-white rounded-[12px] border border-zinc-200 overflow-hidden",
            "shadow-[0_20px_25px_rgba(0,0,0,0.1),0_8px_10px_rgba(0,0,0,0.04)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-150"
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            Command palette
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search pages, students, and teachers
          </DialogPrimitive.Description>

          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-zinc-100">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, students, teachers..."
              className={cn(
                "w-full h-12 bg-transparent text-[14px] text-zinc-800",
                "placeholder:text-zinc-400 outline-none"
              )}
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-[4px] border border-zinc-200 text-[11px] text-zinc-400 shrink-0">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[360px] overflow-y-auto p-1.5">
            {!hasAnyResults && (
              <p className="px-3 py-8 text-center text-[13px] text-zinc-400">
                No results found.
              </p>
            )}

            {navPages.length > 0 && (
              <div className="p-1">
                <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Pages
                </p>
                {navPages.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => goTo(item.href)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                      "text-left text-[13px] text-zinc-700",
                      "hover:bg-zinc-50 transition-colors duration-100"
                    )}
                  >
                    <item.icon className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {matchedStudents.length > 0 && (
              <div className="p-1 border-t border-zinc-100">
                <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Students
                </p>
                {matchedStudents.map((s) => (
                  <button
                    key={s.studentId}
                    onClick={() => goTo(ROUTES.STUDENTS.DETAIL(s.studentId))}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                      "text-left text-[13px] text-zinc-700",
                      "hover:bg-zinc-50 transition-colors duration-100"
                    )}
                  >
                    <GraduationCap className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="truncate">{s.name}</span>
                    {s.className && (
                      <span className="ml-auto text-[11px] text-zinc-400 shrink-0">
                        {s.className}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {matchedTeachers.length > 0 && (
              <div className="p-1 border-t border-zinc-100">
                <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Teachers
                </p>
                {matchedTeachers.map((t) => (
                  <button
                    key={t.teacherId}
                    onClick={() => goTo(ROUTES.TEACHERS.DETAILS(t.teacherId))}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                      "text-left text-[13px] text-zinc-700",
                      "hover:bg-zinc-50 transition-colors duration-100"
                    )}
                  >
                    <Users className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="truncate">{t.teacherName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
