// features/classes/api.ts

import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { ClassDetails, CreateClassDto, UpdateClassDto,Classes } from "./types";

export const classesApi = baseApi.injectEndpoints({
endpoints: (builder) => ({

    // GET /api/Classes - List all classes
    getClasses: builder.query<Classes[], void>({
    query: () => ({
        url: API_ENDPOINTS.CLASSES.GET_ALL,
        method: "GET",
    }),
    keepUnusedDataFor: CACHE_TIMES.NORMAL,
    providesTags: (result) =>
        result
        ? [
            ...result.map(({ classId }) => ({
                type: "Class" as const,
                id: classId,
            })),
            { type: "Class" as const, id: "LIST" },
            ]
        : [{ type: "Class" as const, id: "LIST" }],
    }),

    // GET /api/Classes/{id} - Get single class
    getClass: builder.query<ClassDetails, number>({
    query: (id) => ({
        url: `${API_ENDPOINTS.CLASSES.GET_ALL}/${id}`,
        method: "GET",
    }),
    keepUnusedDataFor: CACHE_TIMES.NORMAL,
    providesTags: (_, __, id) => [{ type: "Class" as const, id }],
    }),

    // POST /api/Classes - Create class
    createClass: builder.mutation<Classes, CreateClassDto>({
      query: (data) => ({
        url: API_ENDPOINTS.CLASSES.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Class" as const, id: "LIST" }],
    }),

    // PUT /api/Classes/{id} - Update class
    updateClass: builder.mutation<Classes, { id: number; data: UpdateClassDto }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.CLASSES.GET_ALL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Class" as const, id },
        { type: "Class" as const, id: "LIST" },
      ],
    }),

    // DELETE /api/Classes/{id} - Delete class
    deleteClass: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.CLASSES.GET_ALL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Class" as const, id: "LIST" }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classesApi;