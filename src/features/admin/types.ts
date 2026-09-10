import type { Role } from "@/constants/roles";

export interface AdminUser {
  id: string;
  userName: string | null;
  email: string | null;
  fullName: string | null;
  gender: string | null;
  roles: Role[] | null;
}

export interface AssignRoleDto {
  userId: string;
  role: Role;
}

export interface RemoveRoleDto {
  userId: string;
  role: Role;
}

export interface UpdateAdminUserDto {
  userName?: string;
  email?: string;
  fullName?: string;
  gender?: string | null;
}

export interface AdminRoleSummary {
  role: Role;
  label: string;
  description: string;
  count: number;
}
