export interface Classroom {
  id: number;
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
