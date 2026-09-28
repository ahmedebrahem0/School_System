"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing, CircleDot, Play, Sparkles, Volume2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  playNotificationSound,
  type NotificationSoundId,
  type SoundPlayback,
} from "../notificationSounds";

const SOUND_OPTIONS = [
  {
    id: "soft-chime" as const,
    name: "Soft Double Chime",
    description: "A warm two-note welcome with a soft, confident finish.",
    duration: "0.7 sec",
    mood: "Warm & polished",
    accent: "emerald" as const,
    icon: Sparkles,
    recommended: true,
  },
  {
    id: "minimal-pop" as const,
    name: "Minimal Pop",
    description: "A compact, clean cue for frequent everyday updates.",
    duration: "0.3 sec",
    mood: "Quick & minimal",
    accent: "violet" as const,
    icon: CircleDot,
    recommended: false,
  },
  {
    id: "gentle-bell" as const,
    name: "Gentle Bell",
    description: "A clear bell tone with a calm, lingering shimmer.",
    duration: "0.9 sec",
    mood: "Clear & graceful",
    accent: "amber" as const,
    icon: BellRing,
    recommended: false,
  },
];

const accentStyles = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    active: "border-emerald-400 shadow-emerald-500/10 dark:border-emerald-400/60",
    bar: "bg-emerald-500 dark:bg-emerald-400",
  },
  violet: {
    icon: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
    active: "border-violet-400 shadow-violet-500/10 dark:border-violet-400/60",
    bar: "bg-violet-500 dark:bg-violet-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
    active: "border-amber-400 shadow-amber-500/10 dark:border-amber-400/60",
    bar: "bg-amber-500 dark:bg-amber-400",
  },
};

const stopAfterMs: Record<NotificationSoundId, number> = {
  "soft-chime": 820,
  "minimal-pop": 440,
  "gentle-bell": 1020,
};

export function NotificationSoundLab() {
  const [volume, setVolume] = useState(65);
  const [playing, setPlaying] = useState<NotificationSoundId | null>(null);
  const playbackRef = useRef<SoundPlayback | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopPreview = () => {
    playbackRef.current?.stop();
    playbackRef.current = null;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(
    () => () => {
      playbackRef.current?.stop();
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  const preview = (id: NotificationSoundId) => {
    stopPreview();
    playbackRef.current = playNotificationSound(id, volume / 100);
    setPlaying(id);
    timerRef.current = window.setTimeout(() => {
      playbackRef.current = null;
      timerRef.current = null;
      setPlaying(null);
    }, stopAfterMs[id]);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Notification sound lab"
        subtitle="Preview three generated tones. Nothing here changes live notifications yet."
      />

      <section
        aria-labelledby="master-volume-label"
        className="mb-5 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#111827]"
      >
        <div className="flex min-w-0 items-center gap-3 sm:w-72">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] dark:bg-blue-400/10 dark:text-blue-300">
            <Volume2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p id="master-volume-label" className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Master volume
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Applied to every preview</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-4">
          <input
            aria-labelledby="master-volume-label"
            aria-valuetext={`${volume}%`}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#1E3A8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-zinc-700 dark:accent-blue-400 dark:focus-visible:ring-offset-[#111827]"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
          <output className="w-11 text-right text-sm font-bold tabular-nums text-[#1E3A8A] dark:text-blue-300">
            {volume}%
          </output>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {SOUND_OPTIONS.map((sound) => {
          const isPlaying = playing === sound.id;
          const styles = accentStyles[sound.accent];
          const Icon = sound.icon;

          return (
            <article
              key={sound.id}
              className={cn(
                "relative flex min-h-72 flex-col overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 dark:bg-[#111827]",
                isPlaying
                  ? cn("-translate-y-0.5 shadow-lg", styles.active)
                  : "border-zinc-200 hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20"
              )}
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <span className={cn("grid size-11 place-items-center rounded-xl ring-1", styles.icon)}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {sound.recommended && (
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    Recommended
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{sound.name}</h2>
              <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-600 dark:text-zinc-400">{sound.description}</p>

              <dl className="mt-5 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="rounded-md bg-zinc-100 px-2 py-1 dark:bg-white/5">
                  <dt className="sr-only">Duration</dt>
                  <dd>{sound.duration}</dd>
                </div>
                <div className="rounded-md bg-zinc-100 px-2 py-1 dark:bg-white/5">
                  <dt className="sr-only">Mood</dt>
                  <dd>{sound.mood}</dd>
                </div>
              </dl>

              <div className="mt-auto pt-6">
                <div className="mb-3 flex h-5 items-end justify-center gap-1" aria-hidden="true">
                  {[9, 15, 20, 13, 18, 11, 16].map((height, index) => (
                    <span
                      key={height + index}
                      className={cn(
                        "w-1 rounded-sm opacity-20",
                        styles.bar,
                        isPlaying && "animate-[sound-wave_620ms_ease-in-out_infinite] opacity-100 motion-reduce:animate-none"
                      )}
                      style={{
                        height,
                        animationDelay: `${index * -75}ms`,
                        transform: isPlaying ? undefined : "scaleY(.35)",
                      }}
                    />
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={isPlaying ? "secondary" : "default"}
                  size="lg"
                  aria-label={`Preview ${sound.name}`}
                  aria-pressed={isPlaying}
                  onClick={() => preview(sound.id)}
                >
                  <Play className={cn("size-4", isPlaying && "fill-current")} aria-hidden="true" />
                  {isPlaying ? "Playing…" : "Preview"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Audio begins only after you click Preview, as required by your browser.
      </p>
    </div>
  );
}
