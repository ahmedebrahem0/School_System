import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { transformResponse } from "@/lib/utils/transformResponse";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
const TOKEN_STORAGE_KEY = "token";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem(TOKEN_STORAGE_KEY)
        : null;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.data) {
    result.data = transformResponse(result.data);
  }

  if (result.error?.status === 401 && typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  keepUnusedDataFor: 300,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  tagTypes: [
    "Admin",
    "Attendance",
    "Auth",
    "Class",
    "Classroom",
    "ClassSubject",
    "Dashboard",
    "Grade",
    "Report",
    "Student",
    "Subject",
    "Teacher",
    "TeacherClass",
    "TeacherSubject",
    "TimeSlot",
    "Timetable",
    "User",
  ],
  endpoints: () => ({}),
});
