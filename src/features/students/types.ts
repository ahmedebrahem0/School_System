// features/students/types.ts

// Student feature types
// Based on actual API response from GET /api/Students

// ─────────────────────────────────────────────────────
// STUDENT
// Shape after transformResponse strips $id and $values
// ─────────────────────────────────────────────────────
export interface Student {
  studentId: number;
  name: string;
  dateOfBirth: string | null;
  classId: number | null;
  applicationUserId: string;
  schoolGradeID: number | null;
  schoolGrade: null;
  class: null;
  applicationUser: null;
  attendances: unknown[];
  grades: unknown[];
}

// ─────────────────────────────────────────────────────
// CREATE STUDENT DTO
// Sent to backend when creating a new student
// Matches multipart/form-data in OpenAPI spec
// ─────────────────────────────────────────────────────
export interface CreateStudentDto {
  Name: string;
  DateOfBirth?: string;
  ClassId?: number;
}

// ─────────────────────────────────────────────────────
// UPDATE STUDENT DTO
// Sent to backend when updating a student
// Matches StudentDTo in OpenAPI spec
// ─────────────────────────────────────────────────────
export interface UpdateStudentDto {
  name: string;
  dateOfBirth?: string;
  classId?: number;
  class?: {
    className: string;
  };
}

// ─────────────────────────────────────────────────────
// STUDENT FORM DATA
// Used by react-hook-form in StudentForm
// ─────────────────────────────────────────────────────
export interface StudentFormData {
  name: string;
  dateOfBirth?: string;
  classId?: number;
}