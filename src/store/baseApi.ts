// store/baseApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { transformResponse } from "@/lib/utils/transformResponse";

// ─────────────────────────────────────────────────────
// BASE URL
// ─────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// ─────────────────────────────────────────────────────
// BASE QUERY
// credentials: "include" → الـ Cookie بتتبعت تلقائياً
// مع كل request من غير ما نعمل أي حاجة إضافية
// ─────────────────────────────────────────────────────
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

// ─────────────────────────────────────────────────────
// BASE QUERY WITH ERROR HANDLING + TRANSFORM
//
// الترتيب جوه الـ function:
// 1. ابعت الـ request
// 2. لو في data → نظفها من $id و $values
// 3. لو في error → تعامل معاه
// 4. ارجع النتيجة
// ─────────────────────────────────────────────────────
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. ابعت الـ request
  const result = await baseQuery(args, api, extraOptions);

  // 2. لو في data → نظفها قبل ما تروح للـ Cache
  //    بنعمله هنا مرة واحدة بدل ما نعمله في كل feature
  if (result.data) {
    result.data = transformResponse(result.data);
  }

  // 3. لو في error → تعامل معاه
  if (result.error) {
    const status = result.error.status;

    // 401 → token انتهى أو مش valid
    // نمسح الـ Cookie عن طريق Route Handler
    // ونحول للـ login
    if (status === 401) {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    }
  }

  // 4. ارجع النتيجة للـ Cache
  return result;
};

// ─────────────────────────────────────────────────────
// CREATE API
// ─────────────────────────────────────────────────────
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,

  // ─────────────────────────────────────────────────
  // CACHE SETTINGS
  //
  // keepUnusedDataFor: 300
  // → 5 دقايق بعد ما الـ Component يتشال
  //   البيانات تفضل في الـ Cache
  //
  // refetchOnFocus: false
  // → متعملش request لما المستخدم يرجع للـ Tab
  //
  // refetchOnReconnect: true
  // → اعمل request لما النت يرجع
  // ─────────────────────────────────────────────────
  keepUnusedDataFor: 300,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  // ─────────────────────────────────────────────────
  // TAG TYPES
  // كل الـ Cache tags في المشروع كله
  // كل feature بتستخدمهم في providesTags و invalidatesTags
  // ─────────────────────────────────────────────────
  tagTypes: [
    "Student",
    "Teacher",
    "Class",
    "Subject",
    "Grade",
    "Attendance",
    "Dashboard",
    "Admin",
    "Report",
    "Auth",
  ],

  endpoints: () => ({}),
});