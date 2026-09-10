export interface Classroom {
  classroomId: number;
  roomNumber: string;
  capacity: number;
}

export interface CreateClassroomDto {
  roomNumber: string;
  capacity: number;
}

export interface UpdateClassroomDto {
  roomNumber?: string;
  capacity?: number;
}
