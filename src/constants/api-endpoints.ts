export const API_ENDPOINTS = {
  HEALTH: {
    ROOT: "/",
    DATABASE: "/health/database",
  },

  AUTH: {
    REGISTER: "/api/Auth/Register",
    LOGIN: "/api/Auth/Login",
  },

  ADMIN: {
    USERS: "/api/Admin/users",
    USER_BY_ID: (id: string) => `/api/Admin/users/${id}`,
    USERS_WITHOUT_ROLE: "/api/Admin/users-without-role",
    ASSIGN_ROLE: "/api/Admin/assign-role",
    REMOVE_ROLE: (userId: string, role: string) =>
      `/api/Admin/users/${userId}/roles/${role}`,
  },

  STUDENTS: {
    GET_ALL: "/api/Students",
    BY_ID: (id: number) => `/api/Students/${id}`,
    ATTENDANCE: "/api/Students/attendance",
    MY_PROFILE: "/api/Students/MyProfile",
  },

  TEACHERS: {
    GET_ALL: "/api/Teachers",
    BY_ID: (id: number) => `/api/Teachers/${id}`,
    MY_PROFILE: "/api/Teachers/MyProfile",
    MY_CLASSES: "/api/Teachers/MyClasses",
    MY_SUBJECTS: "/api/Teachers/MySubjects",
    DETAILS: (id: number) => `/api/Teachers/TeacherDetails/${id}`,
  },

  CLASSES: {
    GET_ALL: "/api/Classes",
    BY_ID: (id: number) => `/api/Classes/${id}`,
    DETAILS: (id: number) => `/api/Classes/Details/${id}`,
    INFORMATION: (classId: number) => `/api/Classes/InFormation/${classId}`,
  },

  SUBJECTS: {
    GET_ALL: "/api/Subjects",
    BY_ID: (id: number) => `/api/Subjects/${id}`,
  },

  CLASSROOMS: {
    GET_ALL: "/api/Classroomes",
    BY_ID: (id: number) => `/api/Classroomes/${id}`,
  },

  TIME_SLOTS: {
    GET_ALL: "/api/TimeSlots",
    BY_ID: (id: number) => `/api/TimeSlots/${id}`,
  },

  CLASS_SUBJECTS: {
    GET_ALL: "/api/ClassSubjects",
    BY_CLASS: (classId: number) => `/api/ClassSubjects/Class/${classId}`,
    BY_SUBJECT: (subjectId: number) => `/api/ClassSubjects/Subject/${subjectId}`,
    BY_IDS: (classId: number, subjectId: number) =>
      `/api/ClassSubjects/${classId}/${subjectId}`,
  },

  TEACHER_CLASSES: {
    GET_ALL: "/api/TeacherClasses",
    BY_IDS: (teacherId: number, classId: number) =>
      `/api/TeacherClasses/${teacherId}/${classId}`,
    BY_TEACHER: (teacherId: number) =>
      `/api/TeacherClasses/Teacher/${teacherId}`,
    BY_CLASS: (classId: number) => `/api/TeacherClasses/Class/${classId}`,
  },

  TEACHER_SUBJECTS: {
    GET_ALL: "/api/TeacherSubjects",
    BY_TEACHER: (teacherId: number) =>
      `/api/TeacherSubjects/Teacher/${teacherId}`,
    BY_SUBJECT: (subjectId: number) =>
      `/api/TeacherSubjects/Subject/${subjectId}`,
    BY_IDS: (teacherId: number, subjectId: number) =>
      `/api/TeacherSubjects/${teacherId}/${subjectId}`,
  },

  GRADES: {
    GET_ALL: "/api/Grades",
    BY_ID: (id: number) => `/api/Grades/${id}`,
    BY_STUDENT: (studentId: number) => `/api/Grades/Student/${studentId}`,
    MY_GRADES: "/api/Grades/MyGrades",
  },

  ATTENDANCES: {
    GET_ALL: "/api/Attendances",
    BY_ID: (id: number) => `/api/Attendances/${id}`,
  },

  TIMETABLES: {
    GET_ALL: "/api/Timetables",
    BY_ID: (id: number) => `/api/Timetables/${id}`,
    BY_CLASS: (classId: number) => `/api/Timetables/Class/${classId}`,
    MY_TIMETABLE: "/api/Timetables/MyTimetable",
  },
} as const;
