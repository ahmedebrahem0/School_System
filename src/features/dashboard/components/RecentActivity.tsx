import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ActivityItem } from "../types";

const toneClass: Record<NonNullable<ActivityItem["tone"]>, string> = {
  blue: "text-blue-600",
  teal: "text-teal-600",
  amber: "text-amber-600",
  emerald: "text-emerald-600",
  red: "text-red-600",
  indigo: "text-indigo-600",
};

interface RecentActivityProps {
  title: string;
  description: string;
  items: ActivityItem[];
}

export function RecentActivity({ title, description, items }: RecentActivityProps) {
  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-[8px] border border-zinc-200 p-4 text-sm"
            >
              <span className="text-zinc-600">{item.label}</span>
              <span className={cn("font-semibold text-zinc-900", item.tone && toneClass[item.tone])}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
