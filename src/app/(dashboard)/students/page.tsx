import Link from "next/link"
import { GraduationCap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import { StudentTable } from "@/features/students/components/StudentTable"
import { StudentTableSkeleton } from "@/features/students/components/StudentTable.skeleton"
import { Suspense } from "react"
import { ROUTES } from "@/constants/routes"

export const metadata = {
  title: "Students | EduSystem",
}

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Dashboard", "Students"]}
        title="Students"
        description="Manage all enrolled students"
        actions={
          <Button asChild>
            <Link href={ROUTES.STUDENTS.CREATE}>
              <Plus size={16} />
              Add Student
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<StudentTableSkeleton />}>
        <StudentTable />
      </Suspense>
    </div>
  )
}
