// components/common/StaggerItem.tsx

// Wraps a single item in a list/grid so it fades and slides in with a
// delay based on its position — used to make dashboard cards, quick
// actions, and activity rows settle into place one after another
// instead of appearing all at once.

import { cn } from "@/lib/utils/cn";

const STEP_MS = 60;
const MAX_DELAY_MS = 480;

interface StaggerItemProps {
  index: number;
  className?: string;
  children: React.ReactNode;
}

export function StaggerItem({ index, className, children }: StaggerItemProps) {
  const delay = Math.min(index * STEP_MS, MAX_DELAY_MS);

  return (
    <div
      className={cn("animate-stagger-in", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
