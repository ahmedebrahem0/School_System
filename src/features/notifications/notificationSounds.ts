export type NotificationSoundId = "soft-chime" | "minimal-pop" | "gentle-bell";

export const ALL_NOTIFICATION_SOUNDS: readonly NotificationSoundId[] = [
  "soft-chime",
  "minimal-pop",
  "gentle-bell",
] as const;

export interface SoundPlayback {
  stop: () => void;
}

const SOUND_DURATION: Record<NotificationSoundId, number> = {
  "soft-chime": 0.7,
  "minimal-pop": 0.32,
  "gentle-bell": 0.9,
};

function tone(
  context: AudioContext,
  output: AudioNode,
  frequency: number,
  start: number,
  duration: number,
  peak: number,
  type: OscillatorType = "sine"
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const beginsAt = context.currentTime + start;
  const endsAt = beginsAt + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, beginsAt);
  gain.gain.setValueAtTime(0.0001, beginsAt);
  gain.gain.exponentialRampToValueAtTime(peak, beginsAt + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, endsAt);
  oscillator.connect(gain);
  gain.connect(output);
  oscillator.start(beginsAt);
  oscillator.stop(endsAt + 0.02);

  return oscillator;
}

export function playNotificationSound(
  sound: NotificationSoundId,
  volume: number
): SoundPlayback {
  const context = new AudioContext();
  const master = context.createGain();
  const safeVolume = Math.min(1, Math.max(0, volume));
  const oscillators: OscillatorNode[] = [];

  master.gain.setValueAtTime(safeVolume * 0.34, context.currentTime);
  master.connect(context.destination);

  if (sound === "soft-chime") {
    oscillators.push(
      tone(context, master, 523.25, 0, 0.43, 0.78),
      tone(context, master, 659.25, 0.22, 0.48, 0.66)
    );
  }

  if (sound === "minimal-pop") {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(680, now);
    oscillator.frequency.exponentialRampToValueAtTime(240, now + 0.3);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.72, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.34);
    oscillators.push(oscillator);
  }

  if (sound === "gentle-bell") {
    oscillators.push(
      tone(context, master, 587.33, 0, 0.88, 0.62),
      tone(context, master, 1174.66, 0, 0.68, 0.25),
      tone(context, master, 1761.99, 0.01, 0.48, 0.11)
    );
  }

  const timer = window.setTimeout(
    () => void context.close(),
    SOUND_DURATION[sound] * 1000 + 120
  );

  return {
    stop: () => {
      window.clearTimeout(timer);
      for (const oscillator of oscillators) {
        try {
          oscillator.stop();
        } catch {
          // The oscillator may already have completed naturally.
        }
      }
      void context.close();
    },
  };
}

