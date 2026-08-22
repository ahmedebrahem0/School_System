// features/students/types.ts

// ─────────────────────────────────────────────────────
// NESTED TYPES
// ─────────────────────────────────────────────────────
export interface StudentClass {
  classId: number;
  className: string;
  schoolGradeID: number | null;
  schoolGrade: null;
  students: null[];
  timetables: unknown[];
  classSubjects: unknown[];
  teacherClasses: unknown[];
}

export interface StudentAttendance {
  attendanceId: number;
  studentId: number;
  date: string;
  status: "Present" | "Absent" | "Late";
  student: null; // circular ref removed
}

export interface StudentSubject {
  subjectId: number;
  subjectName: string;
  grades: unknown[];
  timetables: unknown[];
  classSubjects: unknown[];
  teacherSubjects: null;
}

export interface StudentGrade {
  id: number;
  studentId: number;
  subjectId: number;
  grade: number;
  student: null; // circular ref removed
  subject: StudentSubject;
}

// ─────────────────────────────────────────────────────
// STUDENT — LIST ITEM
// Shape from GET /api/Students (list)
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
// STUDENT DETAILS
// Shape from GET /api/Students/{id} (single)
// Has full nested data
// ─────────────────────────────────────────────────────
export interface StudentDetails extends Omit<Student, "class" | "attendances" | "grades"> {
  class: StudentClass | null;
  attendances: StudentAttendance[];
  grades: StudentGrade[];
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