import * as signalR from "@microsoft/signalr";
import type { AppDispatch } from "@/store";
import { notificationsApi } from "./api";
import type { NotificationFilters, NotificationItem } from "./types";

export interface NotificationConnection {
  start(): Promise<void>;
  stop(): Promise<void>;
  on(name: string, handler: (...args: never[]) => void): void;
  onreconnected(handler: () => void): void;
}

export function registerNotificationHandlers(connection: NotificationConnection, dispatch: AppDispatch) {
  connection.on("NotificationCreated", ((item: NotificationItem) => {
    dispatch((innerDispatch, getState) => {
      const args = notificationsApi.util.selectCachedArgsForQuery(getState(), "getNotifications");
      args.forEach((filters) => {
        const value = (filters ?? {}) as NotificationFilters;
        const matches = (value.page ?? 1) === 1 &&
          (value.isRead === undefined || value.isRead === item.isRead) &&
          (!value.type || value.type === item.type) &&
          (!value.priority || value.priority === item.priority);
        if (!matches) return;
        innerDispatch(notificationsApi.util.updateQueryData("getNotifications", filters, draft => {
          const existing = draft.items.findIndex(entry => entry.id === item.id);
          if (existing >= 0) draft.items.splice(existing, 1);
          draft.items.unshift(item);
          draft.items = draft.items.slice(0, value.pageSize ?? 20);
          draft.totalCount += existing < 0 ? 1 : 0;
        }));
      });
    });
  }) as (...args: never[]) => void);
  connection.on("UnreadCountChanged", ((payload: { count: number }) => {
    dispatch(notificationsApi.util.updateQueryData("getUnreadNotificationCount", undefined, draft => { draft.count = payload.count; }));
  }) as (...args: never[]) => void);
  connection.onreconnected(() => {
    dispatch(notificationsApi.util.invalidateTags([
      { type: "Notification", id: "LIST" },
      { type: "Notification", id: "UNREAD_COUNT" },
    ]));
  });
}

export function createNotificationConnection(token: string): NotificationConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl("/api/backend/hubs/notifications", {
      accessTokenFactory: () => token,
      // Keep the realtime requests on the app origin so they use the existing
      // authenticated proxy and are not blocked by backend CORS. Route
      // Handlers cannot guarantee a WebSocket upgrade, so use HTTP polling.
      transport: signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();
}
