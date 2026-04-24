// constants/api-endpoints.ts

// All API endpoints for the School System
// Centralized to avoid magic strings across the codeGET_ALL
// If the backend changes an endpoint, update it here only

export const API_ENDPOINTS = {

  // Auth endpoints
  AUTH: {
    LOGIN: "/api/Auth/Login",
    REGISTER: "/api/Auth/Register",
  },

  // Admin endpoints
  ADMIN: {
    USERS_WITHOUT_ROLE: "/api/Admin/users-without-role",
    ASSIGN_ROLE: "/api/Admin/assign-role",
  },

  // Students endpoints
  STUDENTS: {
    GET_ALL: "/api/Students",
    BY_ID: (id: number) => `/api/Students/${id}`,
    ATTENDANCE: "/api/Students/attendance",
    MY_PROFILE: "/api/Students/MyProfile",
  },

  // Teachers endpoints
  TEACHERS: {
    GET_ALL: "/api/Teachers",
    BY_ID: (id: number) => `/api/Teachers/${id}`,
    DETAILS: (id: number) => `/api/Teachers/TeacherDetails/${id}`,
  },

  // Classes endpoints
  CLASSES: {
    GET_ALL: "/api/Classes",
    BY_ID: (id: number) => `/api/Classes/${id}`,
    INFORMATION: (classId: number) => `/api/Classes/InFormation/${classId}`,
  },

  // Classrooms endpoints
  CLASSROOMS: {
    GET_ALL: "/api/Classroomes",
    BY_ID: (id: number) => `/api/Classroomes/${id}`,
  },

  // Subjects endpoints
  SUBJECTS: {
    GET_ALL: "/api/Subjects",
    BY_ID: (id: number) => `/api/Subjects/${id}`,
  },

  // Grades endpoints
  GRADES: {
    GET_ALL: "/api/Grades",
    BY_ID: (id: number) => `/api/Grades/${id}`,
    BY_STUDENT_NAME: (name: string) => `/api/Grades/Student/${name}`,
    MY_GRADES: "/api/Grades/MyGrades",
  },

  // Attendances endpoints
  ATTENDANCES: {
    GET_ALL: "/api/Attendances",
    BY_ID: (id: number) => `/api/Attendances/${id}`,
  },

  // Teacher-Class relationship endpoints
  TEACHER_CLASSES: {
    GET_ALL: "/api/TeacherClasses",
    BY_IDS: (teacherId: number, classId: number) =>`/api/TeacherClasses/${teacherId}/${classId}`,
    BY_TEACHER: (teacherId: number) =>`/api/TeacherClasses/Teacher/${teacherId}`,
    BY_CLASS: (classId: number) =>`/api/TeacherClasses/Class/${classId}`,
  },

} as const;