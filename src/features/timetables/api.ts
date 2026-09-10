import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { Timetable, CreateTimetableDto, UpdateTimetableDto } from "./types";

export const timetablesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimetables: builder.query<Timetable[], void>({
      query: () => ({
        url: API_ENDPOINTS.TIMETABLES.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ timetableId }) => ({
                type: "Timetable" as const,
                id: timetableId,
              })),
              { type: "Timetable" as const, id: "LIST" },
            ]
          : [{ type: "Timetable" as const, id: "LIST" }],
    }),

    getTimetable: builder.query<Timetable, number>({
      query: (id) => ({
        url: API_ENDPOINTS.TIMETABLES.BY_ID(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, id) => [{ type: "Timetable" as const, id }],
    }),

    getTimetablesByClass: builder.query<Timetable[], number>({
      query: (classId) => ({
        url: API_ENDPOINTS.TIMETABLES.BY_CLASS(classId),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, classId) => [
        { type: "Timetable" as const, id: `CLASS_${classId}` },
      ],
    }),

    getMyTimetable: builder.query<Timetable[], void>({
      query: () => ({
        url: API_ENDPOINTS.TIMETABLES.MY_TIMETABLE,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.DYNAMIC,
      providesTags: [{ type: "Timetable" as const, id: "MY_TIMETABLE" }],
    }),

    createTimetable: builder.mutation<Timetable, CreateTimetableDto>({
      query: (data) => ({
        url: API_ENDPOINTS.TIMETABLES.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Timetable" as const, id: "LIST" }],
    }),

    updateTimetable: builder.mutation<
      Timetable,
      { id: number; data: UpdateTimetableDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.TIMETABLES.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Timetable" as const, id },
        { type: "Timetable" as const, id: "LIST" },
      ],
    }),

    deleteTimetable: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.TIMETABLES.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Timetable" as const, id },
        { type: "Timetable" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTimetablesQuery,
  useGetTimetableQuery,
  useGetTimetablesByClassQuery,
  useGetMyTimetableQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
} = timetablesApi;
