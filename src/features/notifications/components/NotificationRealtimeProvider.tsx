"use client";

import { useEffect, useEffectEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch } from "@/store/hooks";
import { createNotificationConnection, registerNotificationHandlers } from "../realtime";
import { useNotificationSound } from "../hooks/useNotificationSound";
import { createDeduplicatedNotificationPlayer } from "../notificationSounds";

export function NotificationRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { play, grantAutoplayPermission, hydrated } = useNotificationSound();
  const playLatest = useEffectEvent(() => play());

  // Grant autoplay permission on first user interaction
  useEffect(() => {
    if (!hydrated) return;

    let unlocking = false;
    const handleInteraction = async () => {
      if (unlocking) return;
      unlocking = true;
      const unlocked = await grantAutoplayPermission();
      unlocking = false;
      if (!unlocked) return;
      document.removeEventListener("pointerdown", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("pointerdown", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("pointerdown", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [hydrated, grantAutoplayPermission]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!hydrated || !user || !token) return;

    const connection = createNotificationConnection(token);

    // Play sound when new notification arrives
    const notificationCreatedHandler = createDeduplicatedNotificationPlayer(
      () => playLatest()
    );

    registerNotificationHandlers(connection, dispatch);
    connection.on("NotificationCreated", notificationCreatedHandler);

    connection.start().catch(() => undefined);
    return () => { void connection.stop(); };
  }, [dispatch, user, hydrated]);

  return children;
}
