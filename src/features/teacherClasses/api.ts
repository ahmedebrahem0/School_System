import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { TeacherClass, CreateTeacherClassDto } from "./types";

export const teacherClassesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherClasses: builder.query<TeacherClass[], void>({
      query: () => ({
        url: API_ENDPOINTS.TEACHER_CLASSES.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "TeacherClass" as const, id: "LIST" }],
    }),

    getTeacherClassesByTeacher: builder.query<TeacherClass[], number>({
      query: (teacherId) => ({
        url: API_ENDPOINTS.TEACHER_CLASSES.BY_TEACHER(teacherId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, teacherId) => [
        { type: "TeacherClass" as const, id: `TEACHER_${teacherId}` },
      ],
    }),

    getTeacherClassesByClass: builder.query<TeacherClass[], number>({
      query: (classId) => ({
        url: API_ENDPOINTS.TEACHER_CLASSES.BY_CLASS(classId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, classId) => [
        { type: "TeacherClass" as const, id: `CLASS_${classId}` },
      ],
    }),

    getTeacherClass: builder.query<TeacherClass, { teacherId: number; classId: number }>({
      query: ({ teacherId, classId }) => ({
        url: API_ENDPOINTS.TEACHER_CLASSES.BY_IDS(teacherId, classId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, { teacherId, classId }) => [
        { type: "TeacherClass" as const, id: `${teacherId}_${classId}` },
      ],
    }),

    createTeacherClass: builder.mutation<TeacherClass, CreateTeacherClassDto>({
      query: (data) => ({
        url: API_ENDPOINTS.TEACHER_CLASSES.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "TeacherClass" as const, id: "LIST" },
        { type: "Teacher" as const, id: "LIST" },
        { type: "Class" as const, id: "LIST" },
      ],
    }),

    deleteTeacherClass: builder.mutation<void, { teacherId: number; classId: number }>({
      query: ({ teacherId, classId }) => ({
        url: API_ENDPOINTS.TEACHER_CLASSES.BY_IDS(teacherId, classId),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { teacherId, classId }) => [
        { type: "TeacherClass" as const, id: `${teacherId}_${classId}` },
        { type: "TeacherClass" as const, id: "LIST" },
        { type: "TeacherClass" as const, id: `TEACHER_${teacherId}` },
        { type: "TeacherClass" as const, id: `CLASS_${classId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeacherClassesQuery,
  useGetTeacherClassesByTeacherQuery,
  useGetTeacherClassesByClassQuery,
  useGetTeacherClassQuery,
  useCreateTeacherClassMutation,
  useDeleteTeacherClassMutation,
} = teacherClassesApi;
