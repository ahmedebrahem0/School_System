// lib/utils/formatters.ts

// Utility functions for formatting data across the app
// Used in tables, cards, and detail pages

import { format, parseISO, isValid } from "date-fns";

// ─────────────────────────────────────────────────────
// DATE FORMATTERS
// ─────────────────────────────────────────────────────

// Formats ISO date string to readable format
// Example: "2024-01-15T00:00:00" → "Jan 15, 2024"
// Returns "N/A" if date is null or invalid
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return "N/A";

  const parsed = parseISO(date);

  if (!isValid(parsed)) return "N/A";

  return format(parsed, "MMM dd, yyyy");
};

// Formats ISO date string to short format
// Example: "2024-01-15T00:00:00" → "15/01/2024"
// Used in attendance table
export const formatDateShort = (date: string | null | undefined): string => {
  if (!date) return "N/A";

  const parsed = parseISO(date);

  if (!isValid(parsed)) return "N/A";

  return format(parsed, "dd/MM/yyyy");
};

// Formats date to API expected format
// Example: Date → "2024-01-15"
// Used when sending date to backend
export const formatDateForApi = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// ─────────────────────────────────────────────────────
// GRADE FORMATTERS
// ─────────────────────────────────────────────────────

// Converts numeric grade to letter grade
// Used in GradeTable and GradeBadge
export const getLetterGrade = (grade: number): string => {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
};

// Returns color class based on grade value
// Used in GradeTable and GradeBadge
export const getGradeColor = (grade: number): string => {
  if (grade >= 80) return "text-emerald-600";
  if (grade >= 60) return "text-amber-600";
  return "text-red-600";
};

// Returns pass or fail based on grade
// Passing grade is 60 or above
export const getGradeStatus = (grade: number): "Pass" | "Fail" => {
  return grade >= 60 ? "Pass" : "Fail";
};

// ─────────────────────────────────────────────────────
// STRING FORMATTERS
// ─────────────────────────────────────────────────────

// Returns initials from full name
// Used in Avatar components across the app
// Example: "Ahmed Hassan" → "AH"
// Example: "Sara"         → "S"
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

// Truncates long text with ellipsis
// Used in table cells to prevent overflow
// Example: "Very long class name here" → "Very long cl..."
export const truncate = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};