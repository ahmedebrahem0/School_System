import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type { Classroom, CreateClassroomDto, UpdateClassroomDto } from "./types";

const toClassroomBody = (data: CreateClassroomDto | UpdateClassroomDto) => ({
  RoomNumber: data.roomNumber,
  Capacity: data.capacity,
});

export const classroomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query<Classroom[], void>({
      query: () => ({
        url: API_ENDPOINTS.CLASSROOMS.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ classroomId }) => ({
                type: "Classroom" as const,
                id: classroomId,
              })),
              { type: "Classroom" as const, id: "LIST" },
            ]
          : [{ type: "Classroom" as const, id: "LIST" }],
    }),

    getClassroom: builder.query<Classroom, number>({
      query: (id) => ({
        url: API_ENDPOINTS.CLASSROOMS.BY_ID(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, id) => [{ type: "Classroom" as const, id }],
    }),

    createClassroom: builder.mutation<Classroom, CreateClassroomDto>({
      query: (data) => ({
        url: API_ENDPOINTS.CLASSROOMS.GET_ALL,
        method: "POST",
        body: toClassroomBody(data),
      }),
      invalidatesTags: [{ type: "Classroom" as const, id: "LIST" }],
    }),

    updateClassroom: builder.mutation<
      Classroom,
      { id: number; data: UpdateClassroomDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.CLASSROOMS.BY_ID(id),
        method: "PUT",
        body: toClassroomBody(data),
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Classroom" as const, id },
        { type: "Classroom" as const, id: "LIST" },
      ],
    }),

    deleteClassroom: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.CLASSROOMS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Classroom" as const, id },
        { type: "Classroom" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClassroomsQuery,
  useGetClassroomQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
} = classroomsApi;
