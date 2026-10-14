import { jwtDecode } from "jwt-decode";
import type { AuthUser, UserRole } from "@/types/api.types";
import type { BackendLoginResponse } from "./types";

interface LoginTokenClaims {
  sub?: string;
  UserId?: string;
  email?: string;
  gender?: string;
  fullName?: string;
  role?: UserRole;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: UserRole;
}

export const toAuthUser = (data: BackendLoginResponse): AuthUser | null => {
  if ("user" in data && data.user) return data.user;

  const claims = jwtDecode<LoginTokenClaims>(data.token);
  const backendRole = "role" in data ? data.role : undefined;
  const role =
    backendRole === "Admin" || backendRole === "Teacher" || backendRole === "Student"
      ? backendRole
      : claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        claims.role;

  if (!role) return null;

  const id =
    claims.UserId ||
    claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    "";
  const userName = claims.sub || claims.email || "User";

  return {
    id,
    userName,
    fullName: claims.fullName || userName,
    email: claims.email || "",
    gender: claims.gender || "",
    role,
  };
};
