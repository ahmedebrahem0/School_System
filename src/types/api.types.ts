// types/api.types.ts

// ─────────────────────────────────────────────────────
// API ERROR
// ─────────────────────────────────────────────────────
export interface ApiError {
  status: number;
  data: {
    message?: string;
    errors?: Record<string, string[]>;
  };
}

// ─────────────────────────────────────────────────────
// USER ROLE
//   - AuthProvider
//   - middleware
//   - permissions
//   - Sidebar
// ─────────────────────────────────────────────────────
export type UserRole = "Admin" | "Teacher" | "Student";

// ─────────────────────────────────────────────────────
// AUTH USER
// ─────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  gender: string;
  role: UserRole;
}

// ─────────────────────────────────────────────────────
// LOGIN RESPONSE
// ─────────────────────────────────────────────────────
export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// ─────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─────────────────────────────────────────────────────
// PAGINATE FUNCTION
// ─────────────────────────────────────────────────────
export const paginate = <T>(
  data: T[],
  { page, limit }: PaginationParams
): PaginatedResult<T> => {
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: data.slice(start, end),
    total: data.length,
    page,
    limit,
    totalPages: Math.ceil(data.length / limit),
  };
};