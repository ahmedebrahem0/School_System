export interface Timetable {
  id: number;
  classId: number;
  subjectId: number;
  dayOfWeek: string;
  timeSlotId: number;
  classroomId: number;
}

export interface CreateTimetableDto {
  classId: number;
  subjectId: number;
  dayOfWeek: string;
  timeSlotId: number;
  classroomId: number;
}

export interface UpdateTimetableDto {
  classId?: number;
  subjectId?: number;
  dayOfWeek?: string;
  timeSlotId?: number;
  classroomId?: number;
}
