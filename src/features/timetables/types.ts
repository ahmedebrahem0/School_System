export interface Timetable {
  timetableId: number;
  classId: number;
  className?: string | null;
  subjectId: number;
  subjectName?: string | null;
  dayOfWeek: string;
  timeSlotId: number;
  startTime?: string | null;
  endTime?: string | null;
  classroomId: number;
  roomNumber?: string | null;
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
