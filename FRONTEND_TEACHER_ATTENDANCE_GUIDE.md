# Frontend Guide: Teacher Attendance

## Feature Status

Phase 1 is implemented and ready for frontend integration.

The teacher attendance page must use a dedicated endpoint. It must not use the Admin attendance endpoint and must not send a teacher ID or class ID to define the teacher's data scope.

## Endpoint

```http
GET /api/Attendances/my-classes
```

Required header:

```http
Authorization: Bearer <teacher-jwt-token>
```

No query parameters or request body are required.

## Axios Example

```ts
const response = await api.get<TeacherAttendance[]>(
  "/api/Attendances/my-classes"
);

const attendances = response.data;
```

This example assumes the shared Axios instance already adds the JWT token to the `Authorization` header.

If it does not, send the token explicitly:

```ts
const response = await axios.get<TeacherAttendance[]>(
  `${API_BASE_URL}/api/Attendances/my-classes`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

## TypeScript Type

```ts
export interface TeacherAttendance {
  attendanceId: number;
  studentId: number | null;
  studentName: string | null;
  classId: number | null;
  className: string | null;
  date: string | null;
  status: string | null;
}
```

`date` uses the `yyyy-MM-dd` format, for example `2026-09-29`.

## Successful Response

```json
[
  {
    "attendanceId": 21,
    "studentId": 10,
    "studentName": "Ahmed Ali",
    "classId": 3,
    "className": "Class A",
    "date": "2026-09-29",
    "status": "Present"
  },
  {
    "attendanceId": 22,
    "studentId": 11,
    "studentName": "Sara Mohamed",
    "classId": 3,
    "className": "Class A",
    "date": "2026-09-29",
    "status": "Absent"
  }
]
```

The backend returns only attendance records belonging to classes assigned to the authenticated teacher.

## Empty Response

When the teacher has no assigned classes or no attendance records, the endpoint returns:

```http
200 OK
```

```json
[]
```

This is a normal empty state, not an error. Display a message such as:

```text
No attendance records found.
```

Do not display attendance statistics as failed or misleading zero values when the request itself fails.

## Error Handling

### 401 Unauthorized

Possible causes:

- Token is missing.
- Token is invalid or expired.
- User ID claim is missing.

Frontend behavior: clear invalid authentication state and redirect to login, following the application's existing authentication flow.

### 403 Forbidden

The authenticated account does not have the exact `Teacher` role.

Frontend behavior: show an access-denied page or message. Do not retry with a teacher ID supplied by the client.

### 404 Not Found

The account has the Teacher role but is not linked to a Teacher profile.

Response:

```json
{
  "message": "Teacher profile was not found."
}
```

Frontend behavior: show the returned message and ask an administrator to link the account to a Teacher profile.

### 500 or Network Error

Frontend behavior: show a retry option. Do not treat the result as an empty attendance list.

## Page Integration

Teacher page:

```text
/teacher/attendances
```

Use:

```http
GET /api/Attendances/my-classes
```

Admin page:

```text
/attendances
```

Continue using:

```http
GET /api/Attendances
```

The Admin endpoint remains restricted to Admin accounts.

## Loading State Example

The page should distinguish these states:

```ts
type AttendancePageState =
  | { status: "loading" }
  | { status: "success"; data: TeacherAttendance[] }
  | { status: "unauthorized" }
  | { status: "forbidden" }
  | { status: "profile-not-found"; message: string }
  | { status: "error"; message: string };
```

Recommended rendering rules:

- `loading`: show a loader or skeleton.
- `success` with records: show the attendance table.
- `success` with `[]`: show the normal empty state.
- `unauthorized`: redirect to login.
- `forbidden`: show access denied.
- `profile-not-found`: show the backend message.
- `error`: show an error message and retry button.

## Security Rules for Frontend

- Never send `teacherId` to select attendance scope.
- Never use a stored teacher ID to build this request.
- Do not call `GET /api/Attendances` from the Teacher page.
- The JWT determines the current teacher.
- Route guards improve UX, but the backend remains responsible for authorization.

## Current Permissions

This new endpoint is read-only.

The wider backend currently allows teachers to create and update attendance only for students in their assigned classes. Teachers cannot delete attendance records. Phase 1 does not add a new create or batch UI.

## Deferred Features

Do not assume these APIs exist yet:

- Attendance screen for one class and date.
- Batch attendance save.
- Attendance locking or approval.
- Editing time window.
- Attendance per lesson or time slot.

These features will be documented separately when their backend phases are implemented.

## Backend Confirmation

- Required role: `Teacher`.
- JWT user ID claim: `ClaimTypes.NameIdentifier`.
- Teacher data isolation: enforced by the backend database query.
- Duplicate records caused by multiple class relationships: prevented by the query design.
- Existing database migration: not required for Phase 1.
