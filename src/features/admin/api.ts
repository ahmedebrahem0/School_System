import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import { baseApi } from "@/store/baseApi";
import type {
  AdminUser,
  AssignRoleDto,
  RemoveRoleDto,
  UpdateAdminUserDto,
} from "./types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => ({
        url: API_ENDPOINTS.ADMIN.USERS,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    getAdminUser: builder.query<AdminUser, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ADMIN.USER_BY_ID(id),
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: (_, __, id) => [{ type: "User" as const, id }],
    }),

    getUsersWithoutRole: builder.query<AdminUser[], void>({
      query: () => ({
        url: API_ENDPOINTS.ADMIN.USERS_WITHOUT_ROLE,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.NORMAL,
      providesTags: [{ type: "User" as const, id: "PENDING_ROLES" }],
    }),

    assignRole: builder.mutation<AdminUser, AssignRoleDto>({
      query: (data) => ({
        url: API_ENDPOINTS.ADMIN.ASSIGN_ROLE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: "User" as const, id: userId },
        { type: "User" as const, id: "LIST" },
        { type: "User" as const, id: "PENDING_ROLES" },
      ],
    }),

    removeRole: builder.mutation<AdminUser, RemoveRoleDto>({
      query: ({ userId, role }) => ({
        url: API_ENDPOINTS.ADMIN.REMOVE_ROLE(userId, role),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: "User" as const, id: userId },
        { type: "User" as const, id: "LIST" },
        { type: "User" as const, id: "PENDING_ROLES" },
      ],
    }),

    updateAdminUser: builder.mutation<
      AdminUser,
      { id: string; data: UpdateAdminUserDto }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.ADMIN.USER_BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "User" as const, id },
        { type: "User" as const, id: "LIST" },
      ],
    }),

    deleteAdminUser: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ADMIN.USER_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "User" as const, id },
        { type: "User" as const, id: "LIST" },
        { type: "User" as const, id: "PENDING_ROLES" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAssignRoleMutation,
  useDeleteAdminUserMutation,
  useGetAdminUserQuery,
  useGetAdminUsersQuery,
  useGetUsersWithoutRoleQuery,
  useRemoveRoleMutation,
  useUpdateAdminUserMutation,
} = adminApi;
