export interface ClassSubject {
  classId: number;
  className?: string | null;
  subjectId: number;
  subjectName?: string | null;
}

export interface CreateClassSubjectDto {
  classId: number;
  subjectId: number;
}
