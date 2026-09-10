import { DashboardStatCard } from "./StatCard";
import type { DashboardStat } from "../types";

interface StatsGridProps {
  stats: DashboardStat[];
  columns?: "three" | "four";
}

export function StatsGrid({ stats, columns = "four" }: StatsGridProps) {
  const gridClass =
    columns === "three" ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {stats.map((stat) => (
        <DashboardStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
