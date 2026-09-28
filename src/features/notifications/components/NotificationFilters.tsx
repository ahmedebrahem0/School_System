"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_TYPES,
} from "../types";

interface NotificationFiltersProps {
  read: string;
  type: string;
  priority: string;
  onChange: (key: "read" | "type" | "priority", value: string) => void;
}

export function NotificationFilters({
  read,
  type,
  priority,
  onChange,
}: NotificationFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" aria-label="Notification filters">
      <Select value={read} onValueChange={(value) => onChange("read", value)}>
        <SelectTrigger aria-label="Read status" className="dark:border-white/10 dark:bg-[#111827] dark:text-zinc-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All notifications</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(value) => onChange("type", value)}>
        <SelectTrigger aria-label="Notification type" className="dark:border-white/10 dark:bg-[#111827] dark:text-zinc-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {NOTIFICATION_TYPES.map((item) => (
            <SelectItem key={item} value={item}>
              {item.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={priority}
        onValueChange={(value) => onChange("priority", value)}
      >
        <SelectTrigger aria-label="Notification priority" className="dark:border-white/10 dark:bg-[#111827] dark:text-zinc-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {NOTIFICATION_PRIORITIES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
