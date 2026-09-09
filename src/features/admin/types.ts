import type { Role } from "@/constants/roles";

export interface AdminUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  gender: string | null;
  roles: Role[];
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
