import { useCallback } from "react";
import { toast } from "sonner";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../api";
import type { NotificationItem } from "../types";

const INBOX_QUERY = { page: 1, pageSize: 20 } as const;

export function useNotifications() {
  const inbox = useGetNotificationsQuery(INBOX_QUERY);
  const unread = useGetUnreadNotificationCountQuery();
  const [markRead, markReadState] = useMarkNotificationReadMutation();
  const [markAllRead, markAllReadState] = useMarkAllNotificationsReadMutation();
  const [deleteNotification, deleteState] = useDeleteNotificationMutation();

  const handleRead = useCallback(
    async (item: NotificationItem) => {
      if (item.isRead) return;
      try {
        await markRead({ id: item.id }).unwrap();
      } catch {
        toast.error("Could not mark notification as read");
      }
    },
    [markRead]
  );

  const handleReadAll = useCallback(async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      toast.error("Could not mark notifications as read");
    }
  }, [markAllRead]);

  const handleDelete = useCallback(
    async (item: NotificationItem) => {
      try {
        await deleteNotification({ id: item.id, isRead: item.isRead }).unwrap();
      } catch {
        toast.error("Could not delete notification");
      }
    },
    [deleteNotification]
  );

  const retry = useCallback(() => {
    void inbox.refetch();
    void unread.refetch();
  }, [inbox, unread]);

  return {
    notifications: inbox.data?.items ?? [],
    unreadCount: unread.data?.count ?? 0,
    totalCount: inbox.data?.totalCount ?? 0,
    isLoading: inbox.isLoading || unread.isLoading,
    isError: inbox.isError || unread.isError,
    isMarkingRead: markReadState.isLoading,
    isMarkingAllRead: markAllReadState.isLoading,
    isDeleting: deleteState.isLoading,
    markRead: handleRead,
    markAllRead: handleReadAll,
    deleteNotification: handleDelete,
    retry,
  };
}
