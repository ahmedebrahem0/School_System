import { ROLES, type Role } from "@/constants/roles";

const PERMISSIONS: Record<string, Role[]> = {
  users: [ROLES.ADMIN],
  roles: [ROLES.ADMIN],

  students: [ROLES.ADMIN],
  teachers: [ROLES.ADMIN],
  subjects: [ROLES.ADMIN],
  classrooms: [ROLES.ADMIN, ROLES.TEACHER],
  timeSlots: [ROLES.ADMIN],
  classSubjects: [ROLES.ADMIN],
  teacherClasses: [ROLES.ADMIN],
  teacherSubjects: [ROLES.ADMIN],

  classes: [ROLES.ADMIN, ROLES.TEACHER],
  grades: [ROLES.ADMIN, ROLES.TEACHER],
  attendances: [ROLES.ADMIN, ROLES.TEACHER],
  timetables: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
  reports: [ROLES.ADMIN],

  "my-profile": [ROLES.STUDENT, ROLES.TEACHER],
  "my-grades": [ROLES.STUDENT],
  "my-attendance": [ROLES.STUDENT],
  "my-timetable": [ROLES.STUDENT, ROLES.TEACHER],
  "my-classes": [ROLES.TEACHER],
  "my-subjects": [ROLES.TEACHER],
};

export const canAccess = (role: Role, resource: string): boolean => {
  const allowedRoles = PERMISSIONS[resource];
  return allowedRoles ? allowedRoles.includes(role) : false;
};

export const isAdmin = (role: Role): boolean => role === ROLES.ADMIN;
export const isTeacher = (role: Role): boolean => role === ROLES.TEACHER;
export const isStudent = (role: Role): boolean => role === ROLES.STUDENT;

export const getAllowedResources = (role: Role): string[] => {
  return Object.entries(PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([resource]) => resource);
};
