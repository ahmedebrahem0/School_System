export interface TeacherClass {
  teacherId: number;
  teacherName?: string | null;
  classId: number;
  className?: string | null;
}

export interface CreateTeacherClassDto {
  teacherId: number;
  classId: number;
}
