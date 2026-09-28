// features/teachers/types.ts

export interface TeacherRelation {
  id: number;
  name: string;
}

export interface Teacher {
  teacherId: number;
  teacherName: string | null;
  applicationUserId: string | null;
  subjects: TeacherRelation[];
  classes: TeacherRelation[];
}

export type TeacherDetails = Teacher;

export interface CreateTeacherDto {
  Name: string;
}

export interface UpdateTeacherDto {
  Name: string;
}

export interface TeacherFormData {
  name: string;
}
