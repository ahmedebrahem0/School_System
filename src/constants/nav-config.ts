// constants/nav-config.ts

// Single source of truth for role-based navigation items — used by the
// Sidebar, MobileNav, and the command palette so all three stay in sync.

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  Shield,
  UserCog,
  School,
  CalendarCheck,
  UserCircle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { ROLES } from "./roles";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_CONFIG: Record<string, NavSection[]> = {
  [ROLES.ADMIN]: [
    // Admin links cover the full management surface of the school system.
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Students", href: ROUTES.STUDENTS.LIST, icon: GraduationCap },
        { label: "Teachers", href: ROUTES.TEACHERS.LIST, icon: Users },
        { label: "Classes", href: ROUTES.CLASSES.LIST, icon: School },
        { label: "Subjects", href: ROUTES.SUBJECTS.LIST, icon: BookOpen },
        { label: "Classrooms", href: ROUTES.CLASSROOMS.LIST, icon: School },
      ],
    },
    {
      label: "Academic",
      items: [
        { label: "Grades", href: ROUTES.GRADES.LIST, icon: TrendingUp },
        { label: "Attendances", href: ROUTES.ATTENDANCES.LIST, icon: CalendarCheck },
        { label: "Time Slots", href: ROUTES.TIME_SLOTS.LIST, icon: ClipboardList },
        { label: "Timetables", href: ROUTES.TIMETABLES.LIST, icon: CalendarCheck },
        { label: "Reports", href: ROUTES.REPORTS, icon: BarChart3 },
      ],
    },
    {
      label: "System",
      items: [
        { label: "Users", href: ROUTES.ADMIN.USERS, icon: UserCog },
        { label: "Roles", href: ROUTES.ADMIN.ROLES, icon: Shield },
      ],
    },
  ],

  [ROLES.TEACHER]: [
    // Teacher links focus on the classroom work assigned to the signed-in teacher.
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      ],
    },
    {
      label: "My Work",
      items: [
        { label: "My Classes", href: ROUTES.TEACHER.MY_CLASSES, icon: School },
        { label: "Grades", href: ROUTES.TEACHER.GRADES, icon: TrendingUp },
        { label: "Attendances", href: ROUTES.TEACHER.ATTENDANCES, icon: CalendarCheck },
      ],
    },
  ],

  [ROLES.STUDENT]: [
    // Student links stay scoped to personal academic data and profile views.
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      ],
    },
    {
      label: "My Academics",
      items: [
        { label: "My Profile", href: ROUTES.STUDENT.MY_PROFILE, icon: UserCircle },
        { label: "My Grades", href: ROUTES.STUDENT.MY_GRADES, icon: ClipboardList },
        { label: "My Attendance", href: ROUTES.STUDENT.MY_ATTENDANCE, icon: CalendarCheck },
      ],
    },
  ],
};
