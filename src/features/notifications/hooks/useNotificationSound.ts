"use client";

import { useCallback, useEffect, useState } from "react";
import { playNotificationSound, type NotificationSoundId } from "../notificationSounds";

const STORAGE_SOUND_KEY = "notification-sound-id";
const STORAGE_VOLUME_KEY = "notification-volume";
const STORAGE_ENABLED_KEY = "notification-sound-enabled";
const STORAGE_AUTOREPLAY_KEY = "notification-autoplay-permission";

export function useNotificationSound() {
  const [soundId, setSoundId] = useState<NotificationSoundId>("gentle-bell");
  const [volume, setVolume] = useState(65);
  const [enabled, setEnabled] = useState(true);
  const [hasAutoplayPermission, setHasAutoplayPermission] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOUND_KEY) as NotificationSoundId | null;
      if (saved && ["soft-chime", "minimal-pop", "gentle-bell"].includes(saved)) {
        setSoundId(saved);
      }

      const savedVolume = localStorage.getItem(STORAGE_VOLUME_KEY);
      if (savedVolume) setVolume(Math.max(0, Math.min(100, parseInt(savedVolume, 10))));

      const savedEnabled = localStorage.getItem(STORAGE_ENABLED_KEY);
      if (savedEnabled !== null) setEnabled(savedEnabled === "true");

      const savedPermission = localStorage.getItem(STORAGE_AUTOREPLAY_KEY);
      if (savedPermission !== null) setHasAutoplayPermission(savedPermission === "true");
    } catch {
      // ignore storage errors
    }
    setHydrated(true);
  }, []);

  // Save sound ID to localStorage
  const changeSoundId = useCallback((newId: NotificationSoundId) => {
    setSoundId(newId);
    try {
      localStorage.setItem(STORAGE_SOUND_KEY, newId);
    } catch {
      // ignore
    }
  }, []);

  // Save volume to localStorage
  const changeVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, newVolume));
    setVolume(clamped);
    try {
      localStorage.setItem(STORAGE_VOLUME_KEY, String(clamped));
    } catch {
      // ignore
    }
  }, []);

  // Toggle sound enabled/disabled
  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_ENABLED_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Grant autoplay permission by playing a test sound (requires user gesture)
  const grantAutoplayPermission = useCallback(() => {
    try {
      playNotificationSound("gentle-bell", 0.01).stop(); // silent test
      setHasAutoplayPermission(true);
      localStorage.setItem(STORAGE_AUTOREPLAY_KEY, "true");
    } catch {
      // browser blocked autoplay
    }
  }, []);

  // Play the selected sound
  const play = useCallback(() => {
    if (!enabled || !hydrated) return;

    // Check if browser tab is active
    if (document.hidden) return;

    try {
      playNotificationSound(soundId, volume / 100);
    } catch {
      // audio context or browser restrictions
    }
  }, [soundId, volume, enabled, hydrated]);

  return {
    soundId,
    changeSoundId,
    volume,
    changeVolume,
    enabled,
    toggleEnabled,
    play,
    hasAutoplayPermission,
    grantAutoplayPermission,
    hydrated,
  };
}
