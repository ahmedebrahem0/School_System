// features/auth/api.ts

// Auth API endpoints using RTK Query
// Register goes directly to backend
// Login goes through Next.js Route Handler (for HttpOnly Cookie)

import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { RegisterDto } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ─────────────────────────────────────────────
    // REGISTER
    // Sends registration data directly to backend
    // Returns success message or error
    // ─────────────────────────────────────────────
    register: builder.mutation<void, RegisterDto>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: data,
      }),
    }),

  }),
  overrideExisting: false,
});

export const { useRegisterMutation } = authApi;