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
    // Backend replies with a plain-text message (not JSON), so the
    // default fetchBaseQuery JSON parsing must be overridden here —
    // otherwise a successful 200 response fails with a JSON parse error.
    // ─────────────────────────────────────────────
    register: builder.mutation<string, RegisterDto>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: data,
        responseHandler: "text",
      }),
    }),

  }),
  // catches duplicate endpoints
  overrideExisting: false,
});

export const { useRegisterMutation } = authApi;
