param(
  [ValidateSet("Core", "Accounts", "Relations", "Academic", "Notifications")][string]$Phase = "Core",
  [string]$AdminEmail = "admin@school.com",
  [Parameter(Mandatory = $true)][string]$AdminPassword
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$backendLine = Get-Content (Join-Path $projectRoot ".env.local") |
  Where-Object { $_ -match '^NEXT_PUBLIC_BACKEND_URL=' } |
  Select-Object -First 1
if (-not $backendLine) { throw "NEXT_PUBLIC_BACKEND_URL is missing" }
$backendUrl = ($backendLine -replace '^NEXT_PUBLIC_BACKEND_URL=', '').TrimEnd('/')

function Invoke-Backend {
  param([string]$Path, [string]$Method = "GET", [object]$Body, [hashtable]$Headers = @{})
  $request = @{ Uri = "$backendUrl$Path"; Method = $Method; Headers = $Headers; TimeoutSec = 60 }
  if ($null -ne $Body) {
    $request.Body = $Body | ConvertTo-Json -Depth 10
    $request.ContentType = "application/json"
  }
  try { return Invoke-RestMethod @request } catch {
    $response = $_.Exception.Response
    $responseBody = ""
    if ($response) {
      try {
        $reader = [System.IO.StreamReader]::new($response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
      } catch {}
      throw "$Method $Path failed with $([int]$response.StatusCode): $responseBody"
    }
    throw
  }
}

function Find-Item {
  param([object[]]$Items, [string]$Property, [object]$Value)
  foreach ($item in $Items) {
    if ($item -is [System.Array]) {
      $nested = Find-Item -Items $item -Property $Property -Value $Value
      if ($nested) { return $nested }
    } elseif ($item.$Property -eq $Value) {
      return $item
    }
  }
  return $null
}

function Expand-Items {
  param([object]$InputItems)
  foreach ($item in $InputItems) {
    if ($item -is [System.Array]) {
      Expand-Items $item
    } else {
      Write-Output $item
    }
  }
}

$login = Invoke-Backend "/api/Auth/Login" "POST" @{
  userNameOrEmail = $AdminEmail
  password = $AdminPassword
}
$authHeaders = @{ Authorization = "Bearer $($login.token)" }

$demoClasses = @(
  "Grade 1 - A", "Grade 1 - B", "Grade 2 - A", "Grade 2 - B",
  "Grade 3 - A", "Grade 3 - B", "Grade 4 - A", "Grade 4 - B"
)
$demoSubjects = @(
  "Mathematics", "English Language", "Arabic Language", "General Science",
  "Social Studies", "Computer Science", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Art and Design"
)
$demoClassrooms = @(
  @{ roomNumber = "A-101"; capacity = 30 }, @{ roomNumber = "A-102"; capacity = 30 },
  @{ roomNumber = "A-201"; capacity = 28 }, @{ roomNumber = "A-202"; capacity = 28 },
  @{ roomNumber = "B-101"; capacity = 32 }, @{ roomNumber = "B-102"; capacity = 32 },
  @{ roomNumber = "Science-Lab-1"; capacity = 24 }, @{ roomNumber = "Science-Lab-2"; capacity = 24 },
  @{ roomNumber = "Computer-Lab-1"; capacity = 26 }, @{ roomNumber = "Art-Room"; capacity = 25 }
)
$demoTimeSlots = @(
  @{ startTime = "08:00:00"; endTime = "08:45:00" }, @{ startTime = "08:50:00"; endTime = "09:35:00" },
  @{ startTime = "09:40:00"; endTime = "10:25:00" }, @{ startTime = "10:45:00"; endTime = "11:30:00" },
  @{ startTime = "11:35:00"; endTime = "12:20:00" }, @{ startTime = "12:25:00"; endTime = "13:10:00" },
  @{ startTime = "13:15:00"; endTime = "14:00:00" }, @{ startTime = "14:05:00"; endTime = "14:50:00" }
)

function Seed-Core {
  $classes = @(Expand-Items (Invoke-Backend "/api/Classes" -Headers $authHeaders))
  foreach ($name in $demoClasses) {
    if (-not (Find-Item $classes "className" $name)) {
      $created = Invoke-Backend "/api/Classes" "POST" @{ className = $name } $authHeaders
      $classes += $created
      Write-Host "Created class: $name"
    }
  }
  $subjects = @(Expand-Items (Invoke-Backend "/api/Subjects" -Headers $authHeaders))
  foreach ($name in $demoSubjects) {
    if (-not (Find-Item $subjects "subjectName" $name)) {
      $created = Invoke-Backend "/api/Subjects" "POST" @{ subjectName = $name } $authHeaders
      $subjects += $created
      Write-Host "Created subject: $name"
    }
  }
  $classrooms = @(Expand-Items (Invoke-Backend "/api/Classroomes" -Headers $authHeaders))
  foreach ($room in $demoClassrooms) {
    if (-not (Find-Item $classrooms "roomNumber" $room.roomNumber)) {
      $created = Invoke-Backend "/api/Classroomes" "POST" $room $authHeaders
      $classrooms += $created
      Write-Host "Created classroom: $($room.roomNumber)"
    }
  }
  $slots = @(Expand-Items (Invoke-Backend "/api/TimeSlots" -Headers $authHeaders))
  foreach ($slot in $demoTimeSlots) {
    $found = $false
    for ($index = 0; $index -lt $slots.Count; $index++) {
      if ($slots[$index].startTime -eq $slot.startTime -and $slots[$index].endTime -eq $slot.endTime) {
        $found = $true
        break
      }
    }
    if (-not $found) {
      $created = Invoke-Backend "/api/TimeSlots" "POST" $slot $authHeaders
      $slots += $created
      Write-Host "Created time slot: $($slot.startTime)-$($slot.endTime)"
    }
  }
  Write-Host "Core totals: classes=$($classes.Count), subjects=$($subjects.Count), classrooms=$($classrooms.Count), timeSlots=$($slots.Count)"
}

$teacherNames = @(
  "Omar Hassan", "Mariam Adel", "Youssef Khaled", "Nour Ibrahim",
  "Karim Mahmoud", "Salma Tarek", "Hany Mostafa", "Dina Samir"
)
$studentFirstNames = @(
  "Adam", "Ahmed", "Ali", "Amr", "Aya", "Farah", "Hana", "Hassan",
  "Ibrahim", "Jana", "Khaled", "Laila", "Malak", "Mariam", "Mazen",
  "Mohamed", "Nada", "Nour", "Omar", "Rana", "Salma", "Sara", "Yara", "Youssef"
)
$studentLastNames = @("Adel", "Fathy", "Hassan", "Ibrahim", "Kamal")

function Ensure-RoleAccount {
  param([string]$UserName, [string]$FullName, [string]$Email, [string]$Password, [string]$Role, [string]$Gender)
  $users = Invoke-Backend "/api/Admin/users" -Headers $authHeaders
  $user = Find-Item $users "email" $Email
  if (-not $user) {
    $null = Invoke-Backend "/api/Auth/Register" "POST" @{
      userName = $UserName; fullName = $FullName; gender = $Gender; email = $Email; password = $Password
    }
    $users = Invoke-Backend "/api/Admin/users" -Headers $authHeaders
    $user = Find-Item $users "email" $Email
    if (-not $user) { throw "Registered user was not found: $Email" }
    Write-Host "Registered: $Email"
  }
  if ($user.roles -notcontains $Role) {
    $null = Invoke-Backend "/api/Admin/assign-role" "POST" @{ userId = $user.id; role = $Role } $authHeaders
    Write-Host "Assigned $Role`: $Email"
  }
}

function Seed-Accounts {
  for ($index = 0; $index -lt $teacherNames.Count; $index++) {
    $number = $index + 1
    $female = $teacherNames[$index] -match 'Mariam|Nour|Salma|Dina'
    Ensure-RoleAccount ("teacher.demo{0:D2}" -f $number) $teacherNames[$index] `
      ("teacher.demo{0:D2}@school.com" -f $number) "Teacher@123!" "Teacher" $(if ($female) { "Female" } else { "Male" })
  }
  $number = 0
  foreach ($firstName in $studentFirstNames) {
    foreach ($lastName in $studentLastNames) {
      $number++
      $female = $firstName -match 'Aya|Farah|Hana|Jana|Laila|Malak|Mariam|Nada|Nour|Rana|Salma|Sara|Yara'
      Ensure-RoleAccount ("student.demo{0:D3}" -f $number) "$firstName $lastName" `
        ("student.demo{0:D3}@school.com" -f $number) "Student@123!" "Student" $(if ($female) { "Female" } else { "Male" })
    }
  }
  $teachers = @(Expand-Items (Invoke-Backend "/api/Teachers" -Headers $authHeaders))
  $students = @(Expand-Items (Invoke-Backend "/api/Students" -Headers $authHeaders))
  Write-Host "Account totals: teachers=$($teachers.Count), students=$($students.Count)"
}

function Has-Relation {
  param([object[]]$Items, [hashtable]$Match)
  foreach ($item in $Items) {
    $matches = $true
    foreach ($key in $Match.Keys) {
      if ($item.$key -ne $Match[$key]) { $matches = $false; break }
    }
    if ($matches) { return $true }
  }
  return $false
}

function Seed-Relations {
  $users = @(Expand-Items (Invoke-Backend "/api/Admin/users" -Headers $authHeaders))
  $teachers = @(Expand-Items (Invoke-Backend "/api/Teachers" -Headers $authHeaders))
  $students = @(Expand-Items (Invoke-Backend "/api/Students" -Headers $authHeaders))
  $classes = @(Expand-Items (Invoke-Backend "/api/Classes" -Headers $authHeaders))
  $subjects = @(Expand-Items (Invoke-Backend "/api/Subjects" -Headers $authHeaders))

  $classIds = @($demoClasses | ForEach-Object { (Find-Item $classes "className" $_).classId })
  $subjectIds = @($demoSubjects | ForEach-Object { (Find-Item $subjects "subjectName" $_).subjectId })

  for ($number = 1; $number -le 120; $number++) {
    $email = "student.demo{0:D3}@school.com" -f $number
    $user = Find-Item $users "email" $email
    if (-not $user) { throw "Missing demo user: $email" }
    $student = Find-Item $students "applicationUserId" $user.id
    if (-not $student) { throw "Missing student profile: $email" }
    $classIndex = [Math]::Floor(($number - 1) / 15)
    $gradeIndex = [int][Math]::Floor($classIndex / 2)
    $birthYear = [int](2019 - $gradeIndex)
    $month = (($number - 1) % 12) + 1
    $day = (($number * 3) % 27) + 1
    $dateOfBirth = "{0:D4}-{1:D2}-{2:D2}" -f $birthYear, $month, $day
    if ($student.classId -ne $classIds[$classIndex] -or $student.dateOfBirth -ne $dateOfBirth) {
      $null = Invoke-Backend "/api/Students/$($student.studentId)" "PUT" @{
        name = $student.name
        dateOfBirth = $dateOfBirth
        classId = $classIds[$classIndex]
      } $authHeaders
    }
  }
  Write-Host "Assigned 120 students across 8 classes"

  $teacherClasses = @(Expand-Items (Invoke-Backend "/api/TeacherClasses" -Headers $authHeaders))
  $teacherSubjects = @(Expand-Items (Invoke-Backend "/api/TeacherSubjects" -Headers $authHeaders))
  for ($index = 0; $index -lt 8; $index++) {
    $email = "teacher.demo{0:D2}@school.com" -f ($index + 1)
    $user = Find-Item $users "email" $email
    $teacher = Find-Item $teachers "applicationUserId" $user.id
    if (-not $teacher) { throw "Missing teacher profile: $email" }

    foreach ($classId in @($classIds[$index], $classIds[($index + 1) % 8])) {
      if (-not (Has-Relation $teacherClasses @{ teacherId = $teacher.teacherId; classId = $classId })) {
        $created = Invoke-Backend "/api/TeacherClasses" "POST" @{ teacherId = $teacher.teacherId; classId = $classId } $authHeaders
        $teacherClasses += $created
      }
    }
    foreach ($subjectIndex in @(($index % 12), (($index + 4) % 12), (($index + 8) % 12))) {
      $subjectId = $subjectIds[$subjectIndex]
      if (-not (Has-Relation $teacherSubjects @{ teacherId = $teacher.teacherId; subjectId = $subjectId })) {
        $created = Invoke-Backend "/api/TeacherSubjects" "POST" @{ teacherId = $teacher.teacherId; subjectId = $subjectId } $authHeaders
        $teacherSubjects += $created
      }
    }
  }
  Write-Host "Assigned two classes and three subjects to every demo teacher"

  $classSubjects = @(Expand-Items (Invoke-Backend "/api/ClassSubjects" -Headers $authHeaders))
  for ($classIndex = 0; $classIndex -lt 8; $classIndex++) {
    $indices = @(0, 1, 2, 3, 4, 5)
    foreach ($subjectIndex in $indices) {
      $subjectId = $subjectIds[$subjectIndex]
      if (-not (Has-Relation $classSubjects @{ classId = $classIds[$classIndex]; subjectId = $subjectId })) {
        $created = Invoke-Backend "/api/ClassSubjects" "POST" @{ classId = $classIds[$classIndex]; subjectId = $subjectId } $authHeaders
        $classSubjects += $created
      }
    }
  }
  Write-Host "Assigned six subjects to every demo class"
}

function Seed-Academic {
  $classes = @(Expand-Items (Invoke-Backend "/api/Classes" -Headers $authHeaders))
  $subjects = @(Expand-Items (Invoke-Backend "/api/Subjects" -Headers $authHeaders))
  $classrooms = @(Expand-Items (Invoke-Backend "/api/Classroomes" -Headers $authHeaders))
  $slots = @(Expand-Items (Invoke-Backend "/api/TimeSlots" -Headers $authHeaders))
  $students = @(Expand-Items (Invoke-Backend "/api/Students" -Headers $authHeaders))
  $classIds = @($demoClasses | ForEach-Object { (Find-Item $classes "className" $_).classId })
  $subjectIds = @($demoSubjects | ForEach-Object { (Find-Item $subjects "subjectName" $_).subjectId })
  $roomIds = @($demoClassrooms | ForEach-Object { (Find-Item $classrooms "roomNumber" $_.roomNumber).classroomId })
  $slotIds = @($demoTimeSlots | ForEach-Object {
    $match = $null
    foreach ($slot in $slots) { if ($slot.startTime -eq $_.startTime -and $slot.endTime -eq $_.endTime) { $match = $slot; break } }
    $match.timeSlotId
  })

  $timetables = @(Expand-Items (Invoke-Backend "/api/Timetables" -Headers $authHeaders))
  $days = @("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday")
  for ($classIndex = 0; $classIndex -lt 8; $classIndex++) {
    $classSubjectIds = @($subjectIds[0], $subjectIds[1], $subjectIds[2], $subjectIds[3], $subjectIds[4], $subjectIds[5])
    for ($dayIndex = 0; $dayIndex -lt 5; $dayIndex++) {
      for ($period = 0; $period -lt 4; $period++) {
        $match = @{ classId = $classIds[$classIndex]; dayOfWeek = $days[$dayIndex]; timeSlotId = $slotIds[$period] }
        if (-not (Has-Relation $timetables $match)) {
          $created = Invoke-Backend "/api/Timetables" "POST" @{
            classId = $classIds[$classIndex]
            subjectId = $classSubjectIds[($dayIndex + $period) % $classSubjectIds.Count]
            dayOfWeek = $days[$dayIndex]
            timeSlotId = $slotIds[$period]
            classroomId = $roomIds[($classIndex + $period) % $roomIds.Count]
          } $authHeaders
          $timetables += $created
        }
      }
    }
  }
  Write-Host "Ensured 160 demo timetable entries"

  $demoStudents = @($students | Where-Object { $_.applicationUserId })
  $users = @(Expand-Items (Invoke-Backend "/api/Admin/users" -Headers $authHeaders))
  $demoStudents = @($demoStudents | Where-Object {
    $profile = $_
    $user = Find-Item $users "id" $profile.applicationUserId
    $user -and $user.email -like 'student.demo*@school.com'
  })
  $attendances = @(Expand-Items (Invoke-Backend "/api/Attendances" -Headers $authHeaders))
  $startDate = [datetime]"2026-09-03"
  $schoolDates = @()
  for ($offset = 0; $schoolDates.Count -lt 20; $offset++) {
    $date = $startDate.AddDays($offset)
    if ($date.DayOfWeek -notin @([DayOfWeek]::Friday, [DayOfWeek]::Saturday)) { $schoolDates += $date }
  }
  $createdAttendance = 0
  for ($studentIndex = 0; $studentIndex -lt $demoStudents.Count; $studentIndex++) {
    $student = $demoStudents[$studentIndex]
    for ($dayIndex = 0; $dayIndex -lt $schoolDates.Count; $dayIndex++) {
      $date = $schoolDates[$dayIndex].ToString("yyyy-MM-dd")
      if (-not (Has-Relation $attendances @{ studentId = $student.studentId; date = $date })) {
        $roll = ($studentIndex + $dayIndex) % 10
        $status = if ($roll -eq 0) { "Absent" } elseif ($roll -eq 1) { "Late" } else { "Present" }
        $created = Invoke-Backend "/api/Attendances" "POST" @{ studentId = $student.studentId; date = $date; status = $status } $authHeaders
        $attendances += $created
        $createdAttendance++
      }
    }
  }
  Write-Host "Created $createdAttendance attendance records"

  $grades = @(Expand-Items (Invoke-Backend "/api/Grades" -Headers $authHeaders))
  $createdGrades = 0
  for ($studentIndex = 0; $studentIndex -lt $demoStudents.Count; $studentIndex++) {
    $student = $demoStudents[$studentIndex]
    $existingCount = @($grades | Where-Object { $_.studentId -eq $student.studentId }).Count
    for ($gradeIndex = $existingCount; $gradeIndex -lt 4; $gradeIndex++) {
      $subjectId = $subjectIds[$gradeIndex]
      $score = 65 + (($studentIndex * 7 + $gradeIndex * 5) % 35)
      $created = Invoke-Backend "/api/Grades" "POST" @{ studentId = $student.studentId; subjectId = $subjectId; grade = $score } $authHeaders
      $grades += $created
      $createdGrades++
    }
  }
  Write-Host "Created $createdGrades grade records"
}

function Seed-Notifications {
  $messages = @(
    @{ title = "Welcome to the new school term"; message = "Your classes, timetable, and learning resources are ready."; type = "Announcement"; priority = "High"; targetType = "All" },
    @{ title = "Weekly timetable published"; message = "Review your updated timetable before the first lesson."; type = "ScheduleChanged"; priority = "Normal"; targetType = "Student" },
    @{ title = "Mathematics homework reminder"; message = "Complete the assigned exercises before the next class."; type = "LessonReminder"; priority = "Normal"; targetType = "Student" },
    @{ title = "Science lab preparation"; message = "Bring your lab notebook and required safety equipment."; type = "LessonReminder"; priority = "High"; targetType = "Student" },
    @{ title = "Attendance follow-up"; message = "Review recent attendance records and contact administration if corrections are needed."; type = "AbsenceWarning"; priority = "High"; targetType = "Student" },
    @{ title = "New grades available"; message = "Your latest subject grades are now available in the portal."; type = "GradeAdded"; priority = "Normal"; targetType = "Student" },
    @{ title = "School activity day"; message = "Activity day registration closes at the end of this week."; type = "Announcement"; priority = "Normal"; targetType = "Student" },
    @{ title = "Class assignments updated"; message = "Review the classes currently assigned to your teacher profile."; type = "ClassAssigned"; priority = "Normal"; targetType = "Teacher" },
    @{ title = "Attendance review required"; message = "Please review attendance entries for your assigned classes."; type = "AttendanceRecorded"; priority = "High"; targetType = "Teacher" },
    @{ title = "Subject assignments confirmed"; message = "Your assigned subjects are ready for the current term."; type = "SubjectAssigned"; priority = "Normal"; targetType = "Teacher" },
    @{ title = "Staff meeting reminder"; message = "The weekly staff meeting starts Thursday at 2:30 PM."; type = "Announcement"; priority = "Urgent"; targetType = "Teacher" },
    @{ title = "Portal maintenance completed"; message = "All school portal services are operating normally."; type = "System"; priority = "Low"; targetType = "All" }
  )

  for ($index = 0; $index -lt $messages.Count; $index++) {
    $item = $messages[$index]
    $headers = $authHeaders.Clone()
    $headers["Idempotency-Key"] = "00000000-0000-4000-8000-{0:D12}" -f ($index + 1)
    $body = @{
      title = $item.title
      message = $item.message
      type = $item.type
      priority = $item.priority
      targetType = if ($item.targetType -eq "Student" -or $item.targetType -eq "Teacher") { "Role" } else { $item.targetType }
    }
    if ($body.targetType -eq "Role") { $body.targetId = $item.targetType }
    $result = Invoke-Backend "/api/Notifications/send" "POST" $body $headers
    Write-Host "Notification $($index + 1)/$($messages.Count): recipients=$($result.recipientCount), duplicate=$($result.wasDuplicate)"
  }
}

switch ($Phase) {
  "Core" { Seed-Core }
  "Accounts" { Seed-Accounts }
  "Relations" { Seed-Relations }
  "Academic" { Seed-Academic }
  "Notifications" { Seed-Notifications }
}
