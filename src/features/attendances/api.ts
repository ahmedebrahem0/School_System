import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import { baseApi } from "@/store/baseApi";
import type {
  Attendance,
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from "./types";

export const attendancesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendances: builder.query<Attendance[], void>({
      query: () => ({
        url: API_ENDPOINTS.ATTENDANCES.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ attendanceId }) => ({
                type: "Attendance" as const,
                id: attendanceId,
              })),
              { type: "Attendance" as const, id: "LIST" },
            ]
          : [{ type: "Attendance" as const, id: "LIST" }],
    }),

    getAttendance: builder.query<Attendance, number>({
      query: (id) => ({
        url: API_ENDPOINTS.ATTENDANCES.BY_ID(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, id) => [{ type: "Attendance" as const, id }],
    }),

    createAttendance: builder.mutation<Attendance, CreateAttendanceDto>({
      query: (data) => ({
        url: API_ENDPOINTS.ATTENDANCES.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Attendance" as const, id: "LIST" }],
    }),

    updateAttendance: builder.mutation<
      Attendance,
      { id: number; data: UpdateAttendanceDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.ATTENDANCES.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Attendance" as const, id },
        { type: "Attendance" as const, id: "LIST" },
      ],
    }),

    deleteAttendance: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.ATTENDANCES.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Attendance" as const, id },
        { type: "Attendance" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAttendancesQuery,
  useGetAttendanceQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendancesApi;
