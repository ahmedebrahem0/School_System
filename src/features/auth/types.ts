// features/auth/types.ts

// Auth feature types
// Defines shapes for login, register requests and responses

import type { AuthUser } from "@/types/api.types";

// ─────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────

// Data sent to the backend for login
// Matches LoginDto in the OpenAPI spec exactly
export interface LoginDto {
  userNameOrEmail: string;
  password: string;
}

// Data the login form works with
// Same as LoginDto in this case
export type LoginFormData = LoginDto;

// Response from our Next.js Route Handler after login
// Note: token is stored in HttpOnly Cookie — not returned here
export interface LoginHandlerResponse {
  user: AuthUser;
}

// ─────────────────────────────────────────────────────
// LOGIN BACKEND RESPONSE — TWO POSSIBLE SHAPES
// ─────────────────────────────────────────────────────

// Shape 1: Login successful + role assigned
export interface LoginSuccessResponse {
  token: string;
  user: AuthUser;
}

// Shape 2: Login successful + role pending
export interface LoginPendingResponse {
  token: string;
  roleStatus: "Pending";
  message: string;
}

// Union type — backend can return either shape
export type BackendLoginResponse =
  | LoginSuccessResponse
  | LoginPendingResponse;

// Helper to check which shape we got
// Used in login/route.ts to handle both cases
export const isPendingRole = (
  res: BackendLoginResponse
): res is LoginPendingResponse => {
  return "roleStatus" in res && res.roleStatus === "Pending";
};

// ─────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────

// Data sent to the backend for registration
// Matches RegisterDto in the OpenAPI spec exactly
export interface RegisterDto {
  userName: string;
  fullName: string;
  gender: string;
  email: string;
  password: string;
}

// Data the register form works with
// Extends RegisterDto with confirmPassword field
// confirmPassword is validated locally — never sent to backend
export interface RegisterFormData extends RegisterDto {
  confirmPassword: string;
}