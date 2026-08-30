import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { CreateGradeDto, Grade, UpdateGradeDto } from "./types";
// 
export const gradesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGrades: builder.query<Grade[], void>({
      query: () => ({
        url: API_ENDPOINTS.GRADES.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Grade" as const, id })),
              { type: "Grade" as const, id: "LIST" },
            ]
          : [{ type: "Grade" as const, id: "LIST" }],
    }),

    getGrade: builder.query<Grade, number>({
      query: (id) => ({
        url: API_ENDPOINTS.GRADES.BY_ID(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, id) => [{ type: "Grade" as const, id }],
    }),

    getGradesByStudent: builder.query<Grade[], number>({
      query: (studentId) => ({
        url: API_ENDPOINTS.GRADES.BY_STUDENT(studentId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, studentId) => [
        { type: "Grade" as const, id: `STUDENT-${studentId}` },
      ],
    }),

    getMyGrades: builder.query<Grade[], void>({
      query: () => ({
        url: API_ENDPOINTS.GRADES.MY_GRADES,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "Grade" as const, id: "MY_GRADES" }],
    }),

    createGrade: builder.mutation<Grade, CreateGradeDto>({
      query: (data) => ({
        url: API_ENDPOINTS.GRADES.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Grade" as const, id: "LIST" },
        { type: "Grade" as const, id: "MY_GRADES" },
      ],
    }),

    updateGrade: builder.mutation<
      Grade,
      { id: number; data: UpdateGradeDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.GRADES.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Grade" as const, id },
        { type: "Grade" as const, id: "LIST" },
        { type: "Grade" as const, id: "MY_GRADES" },
      ],
    }),

    deleteGrade: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.GRADES.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Grade" as const, id },
        { type: "Grade" as const, id: "LIST" },
        { type: "Grade" as const, id: "MY_GRADES" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGradesQuery,
  useGetGradeQuery,
  useGetGradesByStudentQuery,
  useGetMyGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} = gradesApi;
