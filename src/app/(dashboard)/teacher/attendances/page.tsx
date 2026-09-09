import { AttendancesManagementPage } from "@/features/attendances/components/AttendancesManagementPage";

export default function Page() {
  return (
    <AttendancesManagementPage
      title="Class Attendances"
      subtitle="Review attendance records when the backend allows teacher access"
      teacherMode
    />
  );
}

