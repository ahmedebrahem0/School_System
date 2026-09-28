import * as signalR from "@microsoft/signalr";
import type { AppDispatch } from "@/store";
import { notificationsApi } from "./api";

export interface NotificationConnection {
  start(): Promise<void>;
  stop(): Promise<void>;
  on(name: string, handler: (...args: never[]) => void): void;
  onreconnected(handler: () => void): void;
}

export function registerNotificationHandlers(connection: NotificationConnection, dispatch: AppDispatch) {
  connection.on("NotificationCreated", (() => {
    dispatch(notificationsApi.util.invalidateTags([{ type: "Notification", id: "LIST" }]));
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
  const configured = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const base = typeof window !== "undefined" && window.location.protocol === "https:"
    ? configured.replace(/^http:/, "https:") : configured;
  return new signalR.HubConnectionBuilder()
    .withUrl(`${base}/hubs/notifications`, { accessTokenFactory: () => token })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();
}
