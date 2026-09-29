"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  isNotificationAudioUnlocked,
  playNotificationSound,
  unlockNotificationAudio,
  type NotificationSoundId,
} from "../notificationSounds";

const STORAGE_SOUND_KEY = "notification-sound-id";
const STORAGE_VOLUME_KEY = "notification-volume";
const STORAGE_ENABLED_KEY = "notification-sound-enabled";

interface SoundSettings {
  soundId: NotificationSoundId;
  volume: number;
  enabled: boolean;
  hydrated: boolean;
  audioUnlocked: boolean;
}

const serverSnapshot: SoundSettings = {
  soundId: "gentle-bell",
  volume: 65,
  enabled: true,
  hydrated: false,
  audioUnlocked: false,
};

let snapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

function validSound(value: string | null): value is NotificationSoundId {
  return value === "soft-chime" || value === "minimal-pop" || value === "gentle-bell";
}

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const storedSound = localStorage.getItem(STORAGE_SOUND_KEY);
    const storedVolumeValue = localStorage.getItem(STORAGE_VOLUME_KEY);
    const storedVolume = Number(storedVolumeValue);
    const storedEnabled = localStorage.getItem(STORAGE_ENABLED_KEY);
    snapshot = {
      soundId: validSound(storedSound) ? storedSound : "gentle-bell",
      volume: Number.isFinite(storedVolume) && storedVolumeValue !== null
        ? Math.max(0, Math.min(100, storedVolume))
        : 65,
      enabled: storedEnabled === null ? true : storedEnabled === "true",
      hydrated: true,
      audioUnlocked: isNotificationAudioUnlocked(),
    };
  } catch {
    snapshot = { ...serverSnapshot, hydrated: true };
  }
}

function emit(next: Partial<SoundSettings>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  initialize();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  initialize();
  return snapshot;
}

export function useNotificationSound() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

  const changeSoundId = useCallback((soundId: NotificationSoundId) => {
    emit({ soundId });
    try { localStorage.setItem(STORAGE_SOUND_KEY, soundId); } catch { /* storage unavailable */ }
  }, []);

  const changeVolume = useCallback((value: number) => {
    const volume = Math.max(0, Math.min(100, value));
    emit({ volume });
    try { localStorage.setItem(STORAGE_VOLUME_KEY, String(volume)); } catch { /* storage unavailable */ }
  }, []);

  const toggleEnabled = useCallback(() => {
    const enabled = !snapshot.enabled;
    emit({ enabled });
    try { localStorage.setItem(STORAGE_ENABLED_KEY, String(enabled)); } catch { /* storage unavailable */ }
  }, []);

  const grantAutoplayPermission = useCallback(async () => {
    const audioUnlocked = await unlockNotificationAudio();
    emit({ audioUnlocked });
    return audioUnlocked;
  }, []);

  const play = useCallback(() => {
    if (!snapshot.enabled || !snapshot.hydrated || !isNotificationAudioUnlocked()) return;
    playNotificationSound(snapshot.soundId, snapshot.volume / 100);
  }, []);

  return {
    ...settings,
    hasAutoplayPermission: settings.audioUnlocked,
    changeSoundId,
    changeVolume,
    toggleEnabled,
    grantAutoplayPermission,
    play,
  };
}
