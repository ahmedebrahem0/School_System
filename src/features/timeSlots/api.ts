import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { TimeSlot, CreateTimeSlotDto, UpdateTimeSlotDto } from "./types";

export const timeSlotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimeSlots: builder.query<TimeSlot[], void>({
      query: () => ({
        url: API_ENDPOINTS.TIME_SLOTS.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ timeSlotId }) => ({
                type: "TimeSlot" as const,
                id: timeSlotId,
              })),
              { type: "TimeSlot" as const, id: "LIST" },
            ]
          : [{ type: "TimeSlot" as const, id: "LIST" }],
    }),

    getTimeSlot: builder.query<TimeSlot, number>({
      query: (id) => ({
        url: API_ENDPOINTS.TIME_SLOTS.BY_ID(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, id) => [{ type: "TimeSlot" as const, id }],
    }),

    createTimeSlot: builder.mutation<TimeSlot, CreateTimeSlotDto>({
      query: (data) => ({
        url: API_ENDPOINTS.TIME_SLOTS.GET_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "TimeSlot" as const, id: "LIST" }],
    }),

    updateTimeSlot: builder.mutation<
      TimeSlot,
      { id: number; data: UpdateTimeSlotDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.TIME_SLOTS.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "TimeSlot" as const, id },
        { type: "TimeSlot" as const, id: "LIST" },
      ],
    }),

    deleteTimeSlot: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.TIME_SLOTS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "TimeSlot" as const, id },
        { type: "TimeSlot" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTimeSlotsQuery,
  useGetTimeSlotQuery,
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation,
} = timeSlotsApi;
