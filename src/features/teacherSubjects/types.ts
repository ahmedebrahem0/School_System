export interface TeacherSubject {
  teacherId: number;
  teacherName?: string | null;
  subjectId: number;
  subjectName?: string | null;
}

export interface CreateTeacherSubjectDto {
  teacherId: number;
  subjectId: number;
}
