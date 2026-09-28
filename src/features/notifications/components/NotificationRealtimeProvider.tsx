"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch } from "@/store/hooks";
import { createNotificationConnection, registerNotificationHandlers } from "../realtime";

export function NotificationRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!user || !token) return;
    const connection = createNotificationConnection(token);
    registerNotificationHandlers(connection, dispatch);
    connection.start().catch(() => undefined);
    return () => { void connection.stop(); };
  }, [dispatch, user]);

  return children;
}
