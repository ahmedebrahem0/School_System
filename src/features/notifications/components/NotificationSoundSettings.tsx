"use client";

import { useEffect, useState } from "react";
import { Bell, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useNotificationSound } from "../hooks/useNotificationSound";
import { playNotificationSound, type NotificationSoundId, ALL_NOTIFICATION_SOUNDS } from "../notificationSounds";

const SOUND_LABELS: Record<NotificationSoundId, { name: string; description: string }> = {
  "soft-chime": {
    name: "Soft Double Chime",
    description: "Warm two-note welcome",
  },
  "minimal-pop": {
    name: "Minimal Pop",
    description: "Quick & minimal",
  },
  "gentle-bell": {
    name: "Gentle Bell",
    description: "Clear & graceful",
  },
};

export function NotificationSoundSettings() {
  const { soundId, changeSoundId, volume, changeVolume, enabled, toggleEnabled, play, hydrated } = useNotificationSound();
  const [playing, setPlaying] = useState<NotificationSoundId | null>(null);

  const previewSound = (id: NotificationSoundId) => {
    if (!hydrated) return;
    setPlaying(id);
    const playback = playNotificationSound(id, volume / 100);
    setTimeout(() => {
      playback.stop();
      setPlaying(null);
    }, 1200);
  };

  if (!hydrated) {
    return (
      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] dark:bg-blue-400/10 dark:text-blue-300">
          <Bell className="size-5" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">Notification sounds</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure your notification alerts</p>
        </div>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-50">Sound alerts</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {enabled ? "Enabled" : "Disabled"}
          </p>
        </div>
        <Button
          variant={enabled ? "default" : "outline"}
          size="sm"
          onClick={toggleEnabled}
          className={enabled ? "" : "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/20"}
        >
          {enabled ? "On" : "Off"}
        </Button>
      </div>

      {enabled && (
        <>
          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {volume > 0 ? (
                <Volume2 className="size-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <VolumeX className="size-4 text-zinc-400" />
              )}
              <label htmlFor="volume" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Volume: {volume}%
              </label>
            </div>
            <input
              id="volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#1E3A8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-zinc-700 dark:accent-blue-400 dark:focus-visible:ring-offset-[#111827]"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Drag to adjust how loud your notifications are
            </p>
          </div>

          {/* Sound Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Select sound</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {ALL_NOTIFICATION_SOUNDS.map((sound) => {
                const isSelected = soundId === sound;
                const isPlaying = playing === sound;
                const label = SOUND_LABELS[sound];

                return (
                  <button
                    key={sound}
                    onClick={() => changeSoundId(sound)}
                    className={cn(
                      "relative flex flex-col gap-1.5 rounded-lg border-2 p-3 text-left transition-all duration-150",
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400/60 dark:bg-blue-400/10"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                    )}
                  >
                    <p className={cn("text-sm font-medium", isSelected ? "text-blue-900 dark:text-blue-200" : "text-zinc-900 dark:text-zinc-50")}>
                      {label.name}
                    </p>
                    <p className={cn("text-xs", isSelected ? "text-blue-700 dark:text-blue-300" : "text-zinc-500 dark:text-zinc-400")}>
                      {label.description}
                    </p>
                    {isSelected && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="inline-flex size-2 rounded-full bg-blue-500" aria-hidden />
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">
                          {isPlaying ? "Playing…" : "Selected"}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Button */}
          <Button
            onClick={() => previewSound(soundId)}
            disabled={playing !== null}
            variant="secondary"
            className="w-full"
          >
            {playing ? "Playing…" : "Preview Sound"}
          </Button>
        </>
      )}

      {!enabled && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          Notifications are currently silent. You won't hear alerts for new messages, grades, or attendance changes.
        </p>
      )}
    </div>
  );
}
