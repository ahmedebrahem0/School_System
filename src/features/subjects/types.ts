// features/subjects/types.ts

export interface Subject {
  subjectId: number;
  subjectName: string;
  teachers: Array<{ id: number; name: string }>;
  classes: Array<{ id: number; name: string }>;
}

export interface SubjectDetails extends Subject {}

export interface CreateSubjectDto {
  subjectName: string;
}

export interface UpdateSubjectDto {
  subjectName: string;
}

export interface SubjectFormData {
  subjectName: string;
}