import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { CACHE_TIMES } from "@/constants/cache-times";
import { baseApi } from "@/store/baseApi";
import type {
  NotificationFilters,
  NotificationItem,
  NotificationPage,
  SendNotificationDto,
  SendNotificationResponse,
  UnreadCountResponse,
} from "./types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationPage, NotificationFilters | void>({
      query: (filters) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.GET_ALL,
        method: "GET",
        params: {
          Page: filters?.page ?? 1,
          PageSize: filters?.pageSize ?? 20,
          ...(filters?.isRead !== undefined && { IsRead: filters.isRead }),
          ...(filters?.type && { Type: filters.type }),
          ...(filters?.priority && { Priority: filters.priority }),
        },
      }),
      keepUnusedDataFor: CACHE_TIMES.DYNAMIC,
      providesTags: (result) => [
        ...(result?.items.map(({ id }) => ({
          type: "Notification" as const,
          id,
        })) ?? []),
        { type: "Notification" as const, id: "LIST" },
      ],
    }),

    getUnreadNotificationCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
        method: "GET",
      }),
      keepUnusedDataFor: CACHE_TIMES.DYNAMIC,
      providesTags: [{ type: "Notification" as const, id: "UNREAD_COUNT" }],
    }),

    markNotificationRead: builder.mutation<void, Pick<NotificationItem, "id">>({
      query: ({ id }) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.READ(id),
        method: "PATCH",
      }),
      async onQueryStarted({ id }, { dispatch, getState, queryFulfilled }) {
        const args = notificationsApi.util.selectCachedArgsForQuery(
          getState(),
          "getNotifications"
        );
        const itemPatches = args.map((queryArgs) =>
          dispatch(
            notificationsApi.util.updateQueryData(
              "getNotifications",
              queryArgs,
              (draft) => {
                const item = draft.items.find((entry) => entry.id === id);
                if (item) item.isRead = true;
              }
            )
          )
        );
        const countPatch = dispatch(
          notificationsApi.util.updateQueryData(
            "getUnreadNotificationCount",
            undefined,
            (draft) => {
              draft.count = Math.max(0, draft.count - 1);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          itemPatches.forEach((patch) => patch.undo());
          countPatch.undo();
        }
      },
      invalidatesTags: (_, error, { id }) =>
        error
          ? []
          : [
              { type: "Notification" as const, id },
              { type: "Notification" as const, id: "UNREAD_COUNT" },
            ],
    }),

    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.NOTIFICATIONS.READ_ALL,
        method: "PATCH",
      }),
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        const args = notificationsApi.util.selectCachedArgsForQuery(
          getState(),
          "getNotifications"
        );
        const itemPatches = args.map((queryArgs) =>
          dispatch(
            notificationsApi.util.updateQueryData(
              "getNotifications",
              queryArgs,
              (draft) => {
                draft.items.forEach((item) => {
                  item.isRead = true;
                });
              }
            )
          )
        );
        const countPatch = dispatch(
          notificationsApi.util.updateQueryData(
            "getUnreadNotificationCount",
            undefined,
            (draft) => {
              draft.count = 0;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          itemPatches.forEach((patch) => patch.undo());
          countPatch.undo();
        }
      },
      invalidatesTags: (_, error) =>
        error
          ? []
          : [
              { type: "Notification" as const, id: "LIST" },
              { type: "Notification" as const, id: "UNREAD_COUNT" },
            ],
    }),

    deleteNotification: builder.mutation<
      void,
      Pick<NotificationItem, "id" | "isRead">
    >({
      query: ({ id }) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.BY_ID(id),
        method: "DELETE",
      }),
      async onQueryStarted(
        { id, isRead },
        { dispatch, getState, queryFulfilled }
      ) {
        const args = notificationsApi.util.selectCachedArgsForQuery(
          getState(),
          "getNotifications"
        );
        const itemPatches = args.map((queryArgs) =>
          dispatch(
            notificationsApi.util.updateQueryData(
              "getNotifications",
              queryArgs,
              (draft) => {
                const index = draft.items.findIndex((item) => item.id === id);
                if (index >= 0) {
                  draft.items.splice(index, 1);
                  draft.totalCount = Math.max(0, draft.totalCount - 1);
                }
              }
            )
          )
        );
        const countPatch = isRead
          ? null
          : dispatch(
              notificationsApi.util.updateQueryData(
                "getUnreadNotificationCount",
                undefined,
                (draft) => {
                  draft.count = Math.max(0, draft.count - 1);
                }
              )
            );

        try {
          await queryFulfilled;
        } catch {
          itemPatches.forEach((patch) => patch.undo());
          countPatch?.undo();
        }
      },
      invalidatesTags: (_, error, { id }) =>
        error
          ? []
          : [
              { type: "Notification" as const, id },
              { type: "Notification" as const, id: "LIST" },
              { type: "Notification" as const, id: "UNREAD_COUNT" },
            ],
    }),

    sendNotification: builder.mutation<
      SendNotificationResponse,
      { data: SendNotificationDto; idempotencyKey: string }
    >({
      query: ({ data, idempotencyKey }) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.SEND,
        method: "POST",
        body: data,
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }),
      invalidatesTags: (_, error) =>
        error
          ? []
          : [
              { type: "Notification" as const, id: "LIST" },
              { type: "Notification" as const, id: "UNREAD_COUNT" },
            ],
    }),
    cancelScheduledNotification: builder.mutation<void, string>({
      query: (id) => ({ url: API_ENDPOINTS.NOTIFICATIONS.CANCEL(id), method: "DELETE" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useSendNotificationMutation,
  useCancelScheduledNotificationMutation,
} = notificationsApi;
