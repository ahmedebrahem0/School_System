// constants/routes.ts

// All application routes in one place
// Used in middleware, sidebar, components, and redirects
// Never use raw strings for routes across the codebase

export const ROUTES = {

  // Auth routes
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },

  // Shared dashboard route
  // Renders different content based on user role
  DASHBOARD: "/dashboard",

  // Admin only routes
  ADMIN: {
    USERS: "/admin/users",
    ROLES: "/admin/roles",
  },

  // Teacher only routes
  TEACHER: {
    MY_CLASSES: "/teacher/my-classes",
    ATTENDANCES: "/teacher/attendances",
    GRADES: "/teacher/grades",
  },

  // Student only routes
  STUDENT: {
    MY_PROFILE: "/student/my-profile",
    MY_GRADES: "/student/my-grades",
    MY_ATTENDANCE: "/student/my-attendance",
  },

  // Shared management routes (Admin + Teacher)
  STUDENTS: {
    LIST: "/students",
    CREATE: "/students/create",
    DETAILS: (id: number) => `/students/${id}`,
  },

  TEACHERS: {
    LIST: "/teachers",
    CREATE: "/teachers/create",
    DETAILS: (id: number) => `/teachers/${id}`,
  },

  CLASSES: {
    LIST: "/classes",
    CREATE: "/classes/create",
    DETAILS: (id: number) => `/classes/${id}`,
  },

  SUBJECTS: {
    LIST: "/subjects",
    CREATE: "/subjects/create",
    DETAILS: (id: number) => `/subjects/${id}`,
  },

  GRADES: {
    LIST: "/grades",
    DETAILS: (id: number) => `/grades/${id}`,
  },

  ATTENDANCES: {
    LIST: "/attendances",
    CREATE: "/attendances/create",
  },

  REPORTS: "/reports",

} as const;

// Routes accessible without authentication
// Used in middleware to skip auth check
export const PUBLIC_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
] as const;

// Default redirect after login per role
// Used in login route handler and middleware
export const DEFAULT_REDIRECT = {
  Admin: ROUTES.DASHBOARD,
  Teacher: ROUTES.DASHBOARD,
  Student: ROUTES.DASHBOARD,
} as const;