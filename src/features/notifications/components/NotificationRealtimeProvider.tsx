"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch } from "@/store/hooks";
import { createNotificationConnection, registerNotificationHandlers } from "../realtime";
import { useNotificationSound } from "../hooks/useNotificationSound";

export function NotificationRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { play, grantAutoplayPermission, hydrated } = useNotificationSound();

  // Grant autoplay permission on first user interaction
  useEffect(() => {
    if (!hydrated) return;

    const handleInteraction = () => {
      grantAutoplayPermission();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [hydrated, grantAutoplayPermission]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!user || !token) return;

    const connection = createNotificationConnection(token);

    // Play sound when new notification arrives
    const notificationCreatedHandler = () => {
      if (hydrated) play();
    };

    const originalRegisterHandlers = registerNotificationHandlers(connection, dispatch);
    connection.on("NotificationCreated", notificationCreatedHandler);

    connection.start().catch(() => undefined);
    return () => { void connection.stop(); };
  }, [dispatch, user, play, hydrated]);

  return children;
}
