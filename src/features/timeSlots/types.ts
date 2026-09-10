export interface TimeSlot {
  timeSlotId: number;
  startTime: string;
  endTime: string;
}

export interface CreateTimeSlotDto {
  startTime: string;
  endTime: string;
}

export interface UpdateTimeSlotDto {
  startTime?: string;
  endTime?: string;
}
