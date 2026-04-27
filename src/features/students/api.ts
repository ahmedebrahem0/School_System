// features/students/api.ts

// Students API endpoints using RTK Query
// Injected into baseApi for code splitting
// POST uses multipart/form-data as per OpenAPI spec

import { baseApi } from "@/store/baseApi";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import type {
  Student,
  StudentDetails,
  CreateStudentDto,
  UpdateStudentDto,
} from "./types";

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ─────────────────────────────────────────────
    // GET ALL STUDENTS
    // Returns list of all students
    // ─────────────────────────────────────────────
    getStudents: builder.query<Student[], void>({
      query: () => ({
        url: API_ENDPOINTS.STUDENTS.GET_ALL,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ studentId }) => ({
                type: "Student" as const,
                id: studentId,
              })),
              { type: "Student" as const, id: "LIST" },
            ]
          : [{ type: "Student" as const, id: "LIST" }],
    }),

    // ─────────────────────────────────────────────
    // GET STUDENT BY ID
    // Returns full student details with nested data
    // ─────────────────────────────────────────────
    getStudent: builder.query<StudentDetails, number>({
      query: (id) => ({
        url: API_ENDPOINTS.STUDENTS.BY_ID(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result, error, id) => [
        { type: "Student" as const, id },
      ],
    }),

    // ─────────────────────────────────────────────
    // GET MY PROFILE
    // Returns current logged-in student profile
    // Used in Student role dashboard
    // ─────────────────────────────────────────────
    getMyProfile: builder.query<StudentDetails, void>({
      query: () => ({
        url: API_ENDPOINTS.STUDENTS.MY_PROFILE,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "Student" as const, id: "MY_PROFILE" }],
    }),

    // ─────────────────────────────────────────────
    // CREATE STUDENT
    // Uses multipart/form-data as per OpenAPI spec
    // Invalidates student list cache after creation
    // ─────────────────────────────────────────────
    createStudent: builder.mutation<void, CreateStudentDto>({
      query: (data) => {
        // Build FormData — backend expects multipart/form-data
        const formData = new FormData();
        formData.append("Name", data.Name);

        if (data.DateOfBirth) {
          formData.append("DateOfBirth", data.DateOfBirth);
        }

        if (data.ClassId !== undefined) {
          formData.append("ClassId", String(data.ClassId));
        }

        return {
          url: API_ENDPOINTS.STUDENTS.GET_ALL,
          method: "POST",
          body: formData,
        };
      },
      // Invalidate list cache — triggers refetch of students list
      invalidatesTags: [{ type: "Student" as const, id: "LIST" }],
    }),

    // ─────────────────────────────────────────────
    // UPDATE STUDENT
    // Uses JSON body as per OpenAPI spec
    // Invalidates both list and specific student cache
    // ─────────────────────────────────────────────
    updateStudent: builder.mutation<
      void,
      { id: number; data: UpdateStudentDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.STUDENTS.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      // Invalidate specific student + list
      invalidatesTags: (result, error, { id }) => [
        { type: "Student" as const, id },
        { type: "Student" as const, id: "LIST" },
      ],
    }),

    // ─────────────────────────────────────────────
    // DELETE STUDENT
    // Query param: ?id={id} as per OpenAPI spec
    // Invalidates student list cache after deletion
    // ─────────────────────────────────────────────
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.STUDENTS.GET_ALL}?id=${id}`,
        method: "DELETE",
      }),
      // Invalidate specific student + list
      invalidatesTags: (result, error, id) => [
        { type: "Student" as const, id },
        { type: "Student" as const, id: "LIST" },
      ],
    }),

  }),
  overrideExisting: false,
});

// Auto-generated hooks from RTK Query
export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useGetMyProfileQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;