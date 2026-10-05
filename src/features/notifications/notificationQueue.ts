import type { NotificationItem } from "./types";

export const NOTIFICATION_ENTRY_GAP_MS = 650;
export const NOTIFICATION_TOAST_DURATION_MS = NOTIFICATION_ENTRY_GAP_MS * 6;

export function getNotificationToastDuration(capacity: number) {
  return Math.max(
    2_600,
    Math.min(NOTIFICATION_TOAST_DURATION_MS, (capacity - 1) * NOTIFICATION_ENTRY_GAP_MS)
  );
}

// Leave room for the header and bottom edge. Each card occupies at most about
// 110px with its two-line preview and the gap below it.
export function getNotificationToastCapacity(viewportHeight: number, isMobile: boolean) {
  const available = Math.max(0, viewportHeight - 112);
  const fitting = Math.max(1, Math.floor(available / 110));
  return Math.min(isMobile ? 4 : 7, fitting);
}

export interface NotificationQueueState {
  pending: NotificationItem[];
  visible: NotificationItem[];
  seenIds: Set<string>;
}

export function createNotificationQueueState(): NotificationQueueState {
  return { pending: [], visible: [], seenIds: new Set() };
}

export function enqueueNotifications(
  state: NotificationQueueState,
  items: NotificationItem[]
): NotificationQueueState {
  const seenIds = new Set(state.seenIds);
  const additions: NotificationItem[] = [];

  items.forEach((item) => {
    if (item.isRead || seenIds.has(item.id)) return;
    seenIds.add(item.id);
    additions.push(item);
  });

  if (additions.length === 0) return state;
  return { ...state, pending: [...state.pending, ...additions], seenIds };
}

export function admitNextNotification(
  state: NotificationQueueState,
  maxVisible: number
): NotificationQueueState {
  if (state.pending.length === 0 || state.visible.length >= maxVisible) return state;
  return {
    ...state,
    pending: state.pending.slice(1),
    visible: [...state.visible, state.pending[0]],
  };
}

export function dismissNotification(
  state: NotificationQueueState,
  id: string
): NotificationQueueState {
  return {
    ...state,
    pending: state.pending.filter((item) => item.id !== id),
    visible: state.visible.filter((item) => item.id !== id),
  };
}

export function reconcileNotificationCapacity(
  state: NotificationQueueState,
  maxVisible: number
): NotificationQueueState {
  if (state.visible.length <= maxVisible) return state;
  const overflow = state.visible.slice(maxVisible);
  return {
    ...state,
    visible: state.visible.slice(0, maxVisible),
    pending: [...overflow, ...state.pending],
  };
}
