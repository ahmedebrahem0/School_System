import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { ClassSubject, CreateClassSubjectDto } from "./types";

export const classSubjectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassSubjects: builder.query<ClassSubject[], void>({
      query: () => ({
        url: API_ENDPOINTS.CLASS_SUBJECTS.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "ClassSubject" as const, id: "LIST" }],
    }),

    getClassSubjectsByClass: builder.query<ClassSubject[], number>({
      query: (classId) => ({
        url: API_ENDPOINTS.CLASS_SUBJECTS.BY_CLASS(classId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, classId) => [
        { type: "ClassSubject" as const, id: `CLASS_${classId}` },
      ],
    }),

    getClassSubjectsBySubject: builder.query<ClassSubject[], number>({
      query: (subjectId) => ({
        url: API_ENDPOINTS.CLASS_SUBJECTS.BY_SUBJECT(subjectId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, subjectId) => [
        { type: "ClassSubject" as const, id: `SUBJECT_${subjectId}` },
      ],
    }),

    getClassSubject: builder.query<ClassSubject, { classId: number; subjectId: number }>({
      query: ({ classId, subjectId }) => ({
        url: API_ENDPOINTS.CLASS_SUBJECTS.BY_IDS(classId, subjectId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, { classId, subjectId }) => [
        { type: "ClassSubject" as const, id: `${classId}_${subjectId}` },
      ],
    }),

    createClassSubject: builder.mutation<ClassSubject, CreateClassSubjectDto>({
      query: (data) => ({
        url: API_ENDPOINTS.CLASS_SUBJECTS.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "ClassSubject" as const, id: "LIST" },
        { type: "Class" as const, id: "LIST" },
        { type: "Subject" as const, id: "LIST" },
      ],
    }),

    deleteClassSubject: builder.mutation<void, { classId: number; subjectId: number }>({
      query: ({ classId, subjectId }) => ({
        url: API_ENDPOINTS.CLASS_SUBJECTS.BY_IDS(classId, subjectId),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { classId, subjectId }) => [
        { type: "ClassSubject" as const, id: `${classId}_${subjectId}` },
        { type: "ClassSubject" as const, id: "LIST" },
        { type: "ClassSubject" as const, id: `CLASS_${classId}` },
        { type: "ClassSubject" as const, id: `SUBJECT_${subjectId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClassSubjectsQuery,
  useGetClassSubjectsByClassQuery,
  useGetClassSubjectsBySubjectQuery,
  useGetClassSubjectQuery,
  useCreateClassSubjectMutation,
  useDeleteClassSubjectMutation,
} = classSubjectsApi;
