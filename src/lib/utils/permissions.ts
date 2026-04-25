// lib/utils/permissions.ts

// Role-based permission system
// Single source of truth for all access control in the app
// Used in middleware, sidebar, and components

import { ROLES, type Role } from "@/constants/roles";

// ─────────────────────────────────────────────────────
// PERMISSIONS MAP
// Defines what each role can access
// Key   → resource name
// Value → array of roles that can access it
// ─────────────────────────────────────────────────────
const PERMISSIONS: Record<string, Role[]> = {
  // Full management — Admin only
  users: [ROLES.ADMIN],
  roles: [ROLES.ADMIN],
  reports: [ROLES.ADMIN],

  // Management — Admin + Teacher
  students: [ROLES.ADMIN, ROLES.TEACHER],
  teachers: [ROLES.ADMIN, ROLES.TEACHER],
  classes: [ROLES.ADMIN, ROLES.TEACHER],
  subjects: [ROLES.ADMIN, ROLES.TEACHER],
  grades: [ROLES.ADMIN, ROLES.TEACHER],
  attendances: [ROLES.ADMIN, ROLES.TEACHER],

  // Student only resources
  "my-profile": [ROLES.STUDENT],
  "my-grades": [ROLES.STUDENT],
  "my-attendance": [ROLES.STUDENT],

  // Teacher only resources
  "my-classes": [ROLES.TEACHER],
};

// ─────────────────────────────────────────────────────
// CAN ACCESS
// Checks if a role has access to a resource
// Used in middleware and components
//
// Example:
//   canAccess("Admin", "students") → true
//   canAccess("Student", "students") → false
// ─────────────────────────────────────────────────────
export const canAccess = (role: Role, resource: string): boolean => {
  const allowedRoles = PERMISSIONS[resource];

  if (!allowedRoles) return false;

  return allowedRoles.includes(role);
};

// ─────────────────────────────────────────────────────
// IS ADMIN
// Quick check for admin role
// Used in components to show/hide admin-only UI
// ─────────────────────────────────────────────────────
export const isAdmin = (role: Role): boolean => {
  return role === ROLES.ADMIN;
};

// ─────────────────────────────────────────────────────
// IS TEACHER
// Quick check for teacher role
// ─────────────────────────────────────────────────────
export const isTeacher = (role: Role): boolean => {
  return role === ROLES.TEACHER;
};

// ─────────────────────────────────────────────────────
// IS STUDENT
// Quick check for student role
// ─────────────────────────────────────────────────────
export const isStudent = (role: Role): boolean => {
  return role === ROLES.STUDENT;
};

// ─────────────────────────────────────────────────────
// GET ALLOWED ROUTES BY ROLE
// Returns all resources a role can access
// Used in sidebar to build navigation dynamically
// ─────────────────────────────────────────────────────
export const getAllowedResources = (role: Role): string[] => {
  return Object.entries(PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([resource]) => resource);
};