export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  grade: number;
}

export interface CreateGradeDto {
  studentId: number;
  subjectId: number;
  grade: number;
}

export interface UpdateGradeDto {
  studentId: number;
  subjectId: number;
  grade: number;
}

export type GradeFormData = CreateGradeDto;
