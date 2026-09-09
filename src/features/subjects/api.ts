// features/subjects/api.ts

import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { Subject, SubjectDetails, CreateSubjectDto, UpdateSubjectDto } from "./types";

export const subjectsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getSubjects: builder.query<Subject[], void>({
            query: () => ({
                url: API_ENDPOINTS.SUBJECTS.GET_ALL,
                method: "GET",
            }),
            keepUnusedDataFor: CACHE_TIMES.NORMAL,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ subjectId }) => ({
                            type: "Subject" as const,
                            id: subjectId,
                        })),
                        { type: "Subject" as const, id: "LIST" },
                    ]
                    : [{ type: "Subject" as const, id: "LIST" }],
        }),

        getSubject: builder.query<SubjectDetails, number>({
            query: (id) => ({
                url: `${API_ENDPOINTS.SUBJECTS.GET_ALL}/${id}`,
                method: "GET",
            }),
            keepUnusedDataFor: CACHE_TIMES.NORMAL,
            providesTags: (_, __, id) => [{ type: "Subject" as const, id }],
        }),

        createSubject: builder.mutation<Subject, CreateSubjectDto>({
            query: (data) => ({
                url: API_ENDPOINTS.SUBJECTS.GET_ALL,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Subject" as const, id: "LIST" }],
        }),

        updateSubject: builder.mutation<Subject, { id: number; data: UpdateSubjectDto }>({
            query: ({ id, data }) => ({
                url: `${API_ENDPOINTS.SUBJECTS.GET_ALL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [
                { type: "Subject" as const, id },
                { type: "Subject" as const, id: "LIST" },
            ],
        }),

        deleteSubject: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_ENDPOINTS.SUBJECTS.GET_ALL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Subject" as const, id: "LIST" }],
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetSubjectsQuery,
    useGetSubjectQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
} = subjectsApi;