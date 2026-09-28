"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../api";
import { getNotificationHref } from "../notificationRoutes";
import {
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_TYPES,
  type NotificationFilters as NotificationFiltersType,
  type NotificationItem,
} from "../types";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationListItem } from "./NotificationListItem";

const PAGE_SIZE = 10;

function positivePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function enumValue<T extends string>(value: string | null, allowed: readonly T[]) {
  return value && allowed.includes(value as T) ? (value as T) : undefined;
}

export function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const page = positivePage(searchParams.get("page"));
  const read = searchParams.get("read") ?? "all";
  const type = enumValue(searchParams.get("type"), NOTIFICATION_TYPES);
  const priority = enumValue(
    searchParams.get("priority"),
    NOTIFICATION_PRIORITIES
  );
  const filters: NotificationFiltersType = {
    page,
    pageSize: PAGE_SIZE,
    ...(read !== "all" && { isRead: read === "read" }),
    ...(type && { type }),
    ...(priority && { priority }),
  };

  const inbox = useGetNotificationsQuery(filters);
  const [markRead, markReadState] = useMarkNotificationReadMutation();
  const [markAllRead, markAllReadState] = useMarkAllNotificationsReadMutation();
  const [deleteNotification, deleteState] = useDeleteNotificationMutation();
  const isMutating =
    markReadState.isLoading || markAllReadState.isLoading || deleteState.isLoading;

  const setParam = useCallback(
    (key: "read" | "type" | "priority", value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") params.delete(key);
      else params.set(key, value);
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextPage === 1) params.delete("page");
      else params.set("page", String(nextPage));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleOpen = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await markRead({ id: item.id }).unwrap();
      } catch {
        toast.error("Could not mark notification as read");
        return;
      }
    }

    const href = getNotificationHref(item, user?.role);
    if (href) router.push(href);
  };

  const handleDelete = async (item: NotificationItem) => {
    try {
      await deleteNotification({ id: item.id, isRead: item.isRead }).unwrap();
    } catch {
      toast.error("Could not delete notification");
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      toast.error("Could not mark notifications as read");
    }
  };

  const items = inbox.data?.items ?? [];
  const total = inbox.data?.totalCount ?? 0;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Review school activity and account updates"
        count={total}
        actions={
          <Button
            variant="outline"
            onClick={() => void handleReadAll()}
            disabled={markAllReadState.isLoading || total === 0}
          >
            <CheckCheck />
            Mark all read
          </Button>
        }
      />

      <div className="mb-5 rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
        <NotificationFilters
          read={read === "read" || read === "unread" ? read : "all"}
          type={type ?? "all"}
          priority={priority ?? "all"}
          onChange={setParam}
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-2 dark:border-white/10 dark:bg-[#111827]">
        {inbox.isLoading && (
          <div className="space-y-3 p-3" aria-label="Loading notifications">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        )}

        {inbox.isError && (
          <ErrorMessage
            description="Notifications could not be loaded."
            onRetry={() => void inbox.refetch()}
          />
        )}

        {!inbox.isLoading && !inbox.isError && items.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No notifications found"
            description="Try another filter or check back later."
          />
        )}

        {!inbox.isLoading &&
          !inbox.isError &&
          items.map((item) => (
            <NotificationListItem
              key={item.id}
              item={item}
              disabled={isMutating}
              onRead={(notification) => void handleOpen(notification)}
              onDelete={(notification) => void handleDelete(notification)}
            />
          ))}

        {inbox.data && (
          <Pagination
            result={{
              data: inbox.data.items,
              total: inbox.data.totalCount,
              page: inbox.data.page,
              limit: inbox.data.pageSize,
              totalPages: inbox.data.totalPages,
            }}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
