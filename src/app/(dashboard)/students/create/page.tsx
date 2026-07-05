import { PageHeader } from "@/components/common/PageHeader"
import { StudentForm } from "@/features/students/components/StudentForm"
import { Card, CardContent } from "@/components/ui/card"
import { ROUTES } from "@/constants/routes"

export const metadata = {
  title: "Add Student | EduSystem",
}

export default function CreateStudentPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        breadcrumb={["Dashboard", "Students", "Add Student"]}
        title="Add New Student"
        description="Fill in the details to enroll a new student"
      />

      <Card>
        <CardContent className="pt-6">
          <StudentForm />
        </CardContent>
      </Card>
    </div>
  )
}