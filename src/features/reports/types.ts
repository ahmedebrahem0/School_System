export interface GradeReportStats {
  totalGrades: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  passingRate: number;
  topPerformer: string;
}

export interface AttendanceReportStats {
  totalRecords: number;
  present: number;
  absent: number;
  late: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
}
