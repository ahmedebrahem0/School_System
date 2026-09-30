"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAppDispatch } from "@/store/hooks";
import { createNotificationConnection, registerNotificationHandlers } from "../realtime";
import { useNotificationSound } from "../hooks/useNotificationSound";
import { useLazyGetNotificationsQuery, useMarkNotificationReadMutation } from "../api";
import { getNotificationHref } from "../notificationRoutes";
import {
  admitNextNotification,
  createNotificationQueueState,
  dismissNotification,
  enqueueNotifications,
  NOTIFICATION_ENTRY_GAP_MS,
  NOTIFICATION_TOAST_DURATION_MS,
  reconcileNotificationCapacity,
} from "../notificationQueue";
import type { NotificationItem } from "../types";
import { NotificationToastStack } from "./NotificationToastStack";

export function NotificationRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { play, grantAutoplayPermission, hydrated } = useNotificationSound();
  const [loadUnread] = useLazyGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [queue, setQueue] = useState(createNotificationQueueState);
  const [isMobile, setIsMobile] = useState(false);
  const dismissTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const exitTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const soundedIds = useRef(new Set<string>());
  const [exitingIds, setExitingIds] = useState<Set<string>>(() => new Set());
  const playLatest = useEffectEvent(() => play());

  const enqueue = useCallback((items: NotificationItem[]) => {
    setQueue((current) => enqueueNotifications(current, items));
  }, []);

  const finishDismiss = useCallback((id: string) => {
    const timer = dismissTimers.current.get(id);
    if (timer) clearTimeout(timer);
    dismissTimers.current.delete(id);
    exitTimers.current.delete(id);
    setExitingIds((current) => {
      if (!current.has(id)) return current;
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setQueue((current) => dismissNotification(current, id));
  }, []);

  const dismiss = useCallback((id: string) => {
    if (exitTimers.current.has(id)) return;
    setExitingIds((current) => new Set(current).add(id));
    exitTimers.current.set(id, setTimeout(() => finishDismiss(id), 240));
  }, [finishDismiss]);

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
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setIsMobile(media.matches);
      setQueue((current) =>
        reconcileNotificationCapacity(current, media.matches ? 1 : 3)
      );
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // A new authenticated identity is a new notification session. Fetching from
  // the network makes old unread items eligible again after every login while
  // the in-memory seen set prevents repeats within this session.
  useEffect(() => {
    dismissTimers.current.forEach(clearTimeout);
    dismissTimers.current.clear();
    exitTimers.current.forEach(clearTimeout);
    exitTimers.current.clear();
    soundedIds.current.clear();
    const resetTimer = setTimeout(() => {
      setQueue(createNotificationQueueState());
      setExitingIds(new Set());
    }, 0);
    if (!user) return () => clearTimeout(resetTimer);

    let active = true;
    const loadAllUnread = async () => {
      let pageNumber = 1;
      try {
        while (active) {
          const page = await loadUnread(
            { page: pageNumber, pageSize: 100, isRead: false },
            false
          ).unwrap();
          if (!active) return;
          enqueue(page.items);
          if (!page.hasNext || pageNumber >= page.totalPages) return;
          pageNumber += 1;
        }
      } catch {
        // The bell retains its own retry UI; a failed page must not break realtime.
      }
    };
    void loadAllUnread();

    return () => {
      active = false;
      clearTimeout(resetTimer);
    };
  }, [user, loadUnread, enqueue]);

  // Admit one card at a time so every card has a distinct entrance and sound.
  useEffect(() => {
    const maxVisible = isMobile ? 1 : 3;
    if (queue.pending.length === 0 || queue.visible.length >= maxVisible) return;
    const timer = setTimeout(() => {
      setQueue((current) => admitNextNotification(current, maxVisible));
    }, queue.visible.length === 0 ? 80 : NOTIFICATION_ENTRY_GAP_MS);
    return () => clearTimeout(timer);
  }, [queue.pending.length, queue.visible.length, isMobile]);

  useEffect(() => {
    queue.visible.forEach((item) => {
      if (soundedIds.current.has(item.id)) return;
      soundedIds.current.add(item.id);
      playLatest();
    });
  }, [queue.visible]);

  useEffect(() => {
    const visibleIds = new Set(queue.visible.map((item) => item.id));
    dismissTimers.current.forEach((timer, id) => {
      if (!visibleIds.has(id)) {
        clearTimeout(timer);
        dismissTimers.current.delete(id);
      }
    });
    queue.visible.forEach((item) => {
      if (dismissTimers.current.has(item.id)) return;
      dismissTimers.current.set(
        item.id,
        setTimeout(() => dismiss(item.id), NOTIFICATION_TOAST_DURATION_MS)
      );
    });
  }, [queue.visible, dismiss]);

  useEffect(() => () => {
    dismissTimers.current.forEach(clearTimeout);
    dismissTimers.current.clear();
    exitTimers.current.forEach(clearTimeout);
    exitTimers.current.clear();
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!hydrated || !user || !token) return;

    const connection = createNotificationConnection(token);

    const notificationCreatedHandler = (item: NotificationItem) => enqueue([item]);

    registerNotificationHandlers(connection, dispatch);
    connection.on(
      "NotificationCreated",
      notificationCreatedHandler as (...args: never[]) => void
    );

    connection.start().catch(() => undefined);
    return () => { void connection.stop(); };
  }, [dispatch, user, hydrated, enqueue]);

  const openNotification = useCallback(async (item: NotificationItem) => {
    dismiss(item.id);
    try {
      await markRead({ id: item.id }).unwrap();
    } catch {
      return;
    }
    const href = getNotificationHref(item, user?.role);
    if (href) router.push(href);
  }, [dismiss, markRead, router, user?.role]);

  return (
    <>
      {children}
      {user && (
        <NotificationToastStack
          items={queue.visible}
          exitingIds={exitingIds}
          onOpen={openNotification}
          onDismiss={dismiss}
        />
      )}
    </>
  );
}
