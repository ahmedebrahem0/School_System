# Backend Requirement: Teacher Attendance Endpoint

## Current Problem

The teacher account can log in successfully, but the following request returns `403 Forbidden`:

```http
GET /api/Attendances
Authorization: Bearer <teacher-token>
```

This endpoint appears to be restricted to Admin accounts. We should not give teachers access to every attendance record. Instead, we need a dedicated endpoint that returns attendance records for the authenticated teacher's assigned classes only.

## Required Endpoint

```http
GET /api/Attendances/my-classes
Authorization: Bearer <teacher-token>
```

The endpoint should be restricted to the Teacher role:

```csharp
[Authorize(Roles = "Teacher")]
```

The existing endpoint should remain restricted to Admin accounts:

```http
GET /api/Attendances
```

## How the Teacher Must Be Identified

The Backend must extract the authenticated user's ID from the JWT claims:

```csharp
var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
```

The Frontend must not send a `teacherId` to determine the data scope. Accepting a teacher ID from the client could allow one teacher to request another teacher's attendance records.

After extracting the user ID, the Backend should:

1. Find the Teacher profile linked to this user ID.
2. Find the classes assigned to this teacher.
3. Find the students enrolled in those classes.
4. Return attendance records belonging only to those students/classes.

Expected data flow:

```text
Authenticated Teacher User
    -> Teacher Profile
    -> Assigned Classes
    -> Students in Assigned Classes
    -> Attendance Records
```

## Response Contract

The response should use the same attendance DTO shape returned by the existing Admin attendance endpoint, so the Frontend can reuse its existing components and types.

Recommended response example:

```json
[
  {
    "attendanceId": 1,
    "studentId": 10,
    "studentName": "Ahmed Ali",
    "classId": 3,
    "className": "Class A",
    "date": "2026-09-29T00:00:00Z",
    "status": "Present"
  }
]
```

If the current Attendance DTO uses different property names, keep the existing contract. The Frontend needs at least:

- `attendanceId`
- `studentId`
- `studentName`
- `classId`
- `className`
- `date`
- `status`

## Expected HTTP Responses

### Records found

```http
200 OK
```

Return the teacher's authorized attendance records.

### No assigned classes or no attendance records

```http
200 OK
```

```json
[]
```

This situation is not an authorization error and should not return `403`.

### Missing or invalid token

```http
401 Unauthorized
```

### Authenticated user is not a Teacher

```http
403 Forbidden
```

### Teacher role exists but no linked Teacher profile is found

Recommended response:

```http
404 Not Found
```

```json
{
  "message": "Teacher profile was not found."
}
```

## Controller Example

The following code is an example. Names should be adjusted to match the existing project architecture:

```csharp
[Authorize(Roles = "Teacher")]
[HttpGet("my-classes")]
public async Task<ActionResult<IReadOnlyList<AttendanceDto>>>
    GetMyClassesAttendances(CancellationToken cancellationToken)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Unauthorized();
    }

    var result = await attendanceService.GetForTeacherAsync(
        userId,
        cancellationToken
    );

    return Ok(result);
}
```

## Query/Service Example

The relationship names in this example are illustrative and must be adapted to the actual entities and database schema:

```csharp
var teacher = await dbContext.Teachers
    .AsNoTracking()
    .SingleOrDefaultAsync(
        teacher => teacher.UserId == userId,
        cancellationToken
    );

if (teacher is null)
{
    throw new NotFoundException("Teacher profile was not found.");
}

var attendances = await dbContext.Attendances
    .AsNoTracking()
    .Where(attendance =>
        attendance.Student.Class.TeacherClasses
            .Any(assignment => assignment.TeacherId == teacher.TeacherId)
    )
    .OrderByDescending(attendance => attendance.Date)
    .Select(attendance => new AttendanceDto
    {
        AttendanceId = attendance.AttendanceId,
        StudentId = attendance.StudentId,
        StudentName = attendance.Student.FullName,
        ClassId = attendance.Student.ClassId,
        ClassName = attendance.Student.Class.Name,
        Date = attendance.Date,
        Status = attendance.Status
    })
    .ToListAsync(cancellationToken);
```

## Security Requirements

- Data filtering must happen entirely in the Backend.
- Do not trust a `teacherId` or `classId` from the Frontend to determine authorization scope.
- A teacher must never receive records for classes not assigned to them.
- Keep `GET /api/Attendances` restricted to Admin accounts.
- Return only the fields required by the Frontend.
- Avoid returning unnecessary navigation properties or sensitive student data.
- Prevent duplicate attendance records when a teacher is assigned to the same class through multiple subjects.
- Apply `AsNoTracking()` to read-only EF Core queries.
- Use a `CancellationToken` for database operations.

## Required Tests

Please add integration or authorization tests covering these cases:

1. A Teacher can call `GET /api/Attendances/my-classes` successfully.
2. A Teacher receives attendance records for assigned classes only.
3. A Teacher cannot see records from another teacher's classes.
4. A Teacher with no assigned classes receives `200 OK` with `[]`.
5. A request without a token receives `401 Unauthorized`.
6. A Student receives `403 Forbidden`.
7. An Admin receives `403 Forbidden` from this Teacher-only endpoint unless allowing Admin is an intentional requirement.
8. `GET /api/Attendances` remains restricted to Admin accounts.
9. Records are not duplicated if a teacher is linked to the same class through multiple subjects.
10. A Teacher role without a linked Teacher profile receives the agreed error response.

## Information Needed by the Frontend Team

After implementing the endpoint, please provide:

1. The final endpoint path.
2. A real JSON response example.
3. The confirmed HTTP status codes.
4. Confirmation that the JWT role value is exactly `Teacher`.
5. Confirmation of which JWT claim contains the user ID.
6. Confirmation whether this endpoint is read-only.
7. Clarification on whether teachers will later be allowed to create or update attendance records.

## Planned Frontend Integration

After the Backend endpoint is ready:

- `/teacher/attendances` will call the new Teacher-scoped endpoint.
- `/attendances` will continue calling the Admin endpoint.
- The Teacher page will remain read-only unless create/update permissions are explicitly added.
- Empty results will display a normal empty state.
- `401`, `403`, and server/network errors will display different messages.
- Attendance statistics will not display misleading zero values when the request has failed.

