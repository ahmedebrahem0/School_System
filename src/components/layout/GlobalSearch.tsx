// components/layout/GlobalSearch.tsx

// Header search box — filters already-fetched students & teachers by name
// and jumps to the matching detail page. Only useful for roles that can
// see the students/teachers management pages (Admin, Teacher).

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, Users } from "lucide-react";
import { useGetStudentsQuery } from "@/features/students/api";
import { useGetTeachersQuery } from "@/features/teachers/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { canAccess } from "@/lib/utils/permissions";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const MAX_RESULTS_PER_GROUP = 5;

const GlobalSearch = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canSearchStudents = !!user && canAccess(user.role, "students");
  const canSearchTeachers = !!user && canAccess(user.role, "teachers");

  const { data: students = [] } = useGetStudentsQuery(undefined, {
    skip: !canSearchStudents,
  });
  const { data: teachers = [] } = useGetTeachersQuery(undefined, {
    skip: !canSearchTeachers,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const term = query.trim().toLowerCase();

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

  const hasResults = matchedStudents.length > 0 || matchedTeachers.length > 0;
  const showDropdown = isOpen && term.length > 0;

  const goTo = (href: string) => {
    router.push(href);
    setQuery("");
    setIsOpen(false);
  };

  if (!canSearchStudents && !canSearchTeachers) return null;

  return (
    <div className="relative" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search students, teachers..."
        className={cn(
          "w-[320px] h-9 pl-10 pr-4",
          "bg-zinc-100 border border-zinc-200 rounded-full",
          "text-[13px] text-zinc-700 placeholder:text-zinc-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          "focus:border-blue-400 focus:bg-white",
          "transition-all duration-200"
        )}
      />

      {showDropdown && (
        <div
          className={cn(
            "absolute left-0 top-full mt-2 w-[360px]",
            "bg-white rounded-xl shadow-lg border border-zinc-200",
            "overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150",
            "max-h-[360px] overflow-y-auto"
          )}
        >
          {!hasResults && (
            <p className="px-4 py-6 text-center text-[13px] text-zinc-400">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {matchedStudents.length > 0 && (
            <div className="p-1.5">
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
            <div className="p-1.5 border-t border-zinc-100">
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
      )}
    </div>
  );
};

export default GlobalSearch;
