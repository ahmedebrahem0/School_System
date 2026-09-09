import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { TeacherSubject, CreateTeacherSubjectDto } from "./types";

export const teacherSubjectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherSubjects: builder.query<TeacherSubject[], void>({
      query: () => ({
        url: API_ENDPOINTS.TEACHER_SUBJECTS.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "TeacherSubject" as const, id: "LIST" }],
    }),

    getTeacherSubjectsByTeacher: builder.query<TeacherSubject[], number>({
      query: (teacherId) => ({
        url: API_ENDPOINTS.TEACHER_SUBJECTS.BY_TEACHER(teacherId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, teacherId) => [
        { type: "TeacherSubject" as const, id: `TEACHER_${teacherId}` },
      ],
    }),

    getTeacherSubjectsBySubject: builder.query<TeacherSubject[], number>({
      query: (subjectId) => ({
        url: API_ENDPOINTS.TEACHER_SUBJECTS.BY_SUBJECT(subjectId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, subjectId) => [
        { type: "TeacherSubject" as const, id: `SUBJECT_${subjectId}` },
      ],
    }),

    getTeacherSubject: builder.query<TeacherSubject, { teacherId: number; subjectId: number }>({
      query: ({ teacherId, subjectId }) => ({
        url: API_ENDPOINTS.TEACHER_SUBJECTS.BY_IDS(teacherId, subjectId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, { teacherId, subjectId }) => [
        { type: "TeacherSubject" as const, id: `${teacherId}_${subjectId}` },
      ],
    }),

    createTeacherSubject: builder.mutation<TeacherSubject, CreateTeacherSubjectDto>({
      query: (data) => ({
        url: API_ENDPOINTS.TEACHER_SUBJECTS.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "TeacherSubject" as const, id: "LIST" },
        { type: "Teacher" as const, id: "LIST" },
        { type: "Subject" as const, id: "LIST" },
      ],
    }),

    deleteTeacherSubject: builder.mutation<void, { teacherId: number; subjectId: number }>({
      query: ({ teacherId, subjectId }) => ({
        url: API_ENDPOINTS.TEACHER_SUBJECTS.BY_IDS(teacherId, subjectId),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { teacherId, subjectId }) => [
        { type: "TeacherSubject" as const, id: `${teacherId}_${subjectId}` },
        { type: "TeacherSubject" as const, id: "LIST" },
        { type: "TeacherSubject" as const, id: `TEACHER_${teacherId}` },
        { type: "TeacherSubject" as const, id: `SUBJECT_${subjectId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeacherSubjectsQuery,
  useGetTeacherSubjectsByTeacherQuery,
  useGetTeacherSubjectsBySubjectQuery,
  useGetTeacherSubjectQuery,
  useCreateTeacherSubjectMutation,
  useDeleteTeacherSubjectMutation,
} = teacherSubjectsApi;
