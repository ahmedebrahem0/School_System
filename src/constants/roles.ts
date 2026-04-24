// constants/roles.ts

// User roles in the School System
// Used in middleware, sidebar, permissions, and components
// Always use these constants instead of raw strings

export const ROLES = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
} as const;

// Role type derived from ROLES constant
// Automatically updates if ROLES changes
export type Role = (typeof ROLES)[keyof typeof ROLES];

// All roles as array
// Useful when you need to iterate over all roles
// Example: building role selection dropdown in AssignRoleModal
export const ALL_ROLES = Object.values(ROLES);

// Role display names and metadata
// Used in UI components like AssignRoleModal and Sidebar
export const ROLE_META = {
  [ROLES.ADMIN]: {
    label: "Admin",
    description: "Full system access and management",
    color: "bg-indigo-100 text-indigo-700",
  },
  [ROLES.TEACHER]: {
    label: "Teacher",
    description: "Manage classes, grades and attendance",
    color: "bg-teal-100 text-teal-700",
  },
  [ROLES.STUDENT]: {
    label: "Student",
    description: "View grades and attendance records",
    color: "bg-blue-100 text-blue-700",
  },
} as const;