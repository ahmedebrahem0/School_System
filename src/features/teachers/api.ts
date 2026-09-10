// features/teachers/api.ts

import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type {
  CreateTeacherDto,
  Teacher,
  TeacherDetails,
  TeacherRelation,
  UpdateTeacherDto,
} from "./types";

const toTeacherFormBody = (name: string) => {
  const body = new URLSearchParams();
  body.set("Name", name);
  return body;
};

export const teachersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<Teacher[], void>({
      query: () => ({
        url: API_ENDPOINTS.TEACHERS.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ teacherId }) => ({
                type: "Teacher" as const,
                id: teacherId,
              })),
              { type: "Teacher" as const, id: "LIST" },
            ]
          : [{ type: "Teacher" as const, id: "LIST" }],
    }),

    getTeacher: builder.query<TeacherDetails, number>({
      query: (id) => ({
        url: API_ENDPOINTS.TEACHERS.DETAILS(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, id) => [{ type: "Teacher" as const, id }],
    }),

    getMyTeacherProfile: builder.query<TeacherDetails, void>({
      query: () => ({
        url: API_ENDPOINTS.TEACHERS.MY_PROFILE,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "Teacher" as const, id: "MY_PROFILE" }],
    }),

    getMyTeacherClasses: builder.query<TeacherRelation[], void>({
      query: () => ({
        url: API_ENDPOINTS.TEACHERS.MY_CLASSES,
        method: "GET",
      }),
      transformResponse: (response: TeacherRelation | TeacherRelation[] | null) =>
        Array.isArray(response) ? response : response ? [response] : [],
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "Teacher" as const, id: "MY_CLASSES" }],
    }),

    getMyTeacherSubjects: builder.query<TeacherRelation[], void>({
      query: () => ({
        url: API_ENDPOINTS.TEACHERS.MY_SUBJECTS,
        method: "GET",
      }),
      transformResponse: (response: TeacherRelation | TeacherRelation[] | null) =>
        Array.isArray(response) ? response : response ? [response] : [],
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "Teacher" as const, id: "MY_SUBJECTS" }],
    }),

    createTeacher: builder.mutation<Teacher, CreateTeacherDto>({
      query: (data) => ({
        url: API_ENDPOINTS.TEACHERS.GET_ALL,
        method: "POST",
        body: toTeacherFormBody(data.Name),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      invalidatesTags: [{ type: "Teacher" as const, id: "LIST" }],
    }),

    updateTeacher: builder.mutation<
      Teacher,
      { id: number; data: UpdateTeacherDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.TEACHERS.BY_ID(id),
        method: "PUT",
        body: toTeacherFormBody(data.Name),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Teacher" as const, id },
        { type: "Teacher" as const, id: "LIST" },
      ],
    }),

    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.TEACHERS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Teacher" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeachersQuery,
  useGetTeacherQuery,
  useGetMyTeacherProfileQuery,
  useGetMyTeacherClassesQuery,
  useGetMyTeacherSubjectsQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teachersApi;
