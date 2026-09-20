import { StaggerItem } from "@/components/common/StaggerItem";
import { DashboardStatCard } from "./StatCard";
import type { DashboardStat } from "../types";

interface StatsGridProps {
  stats: DashboardStat[];
  columns?: "three" | "four";
  startIndex?: number;
}

export function StatsGrid({ stats, columns = "four", startIndex = 0 }: StatsGridProps) {
  const gridClass =
    columns === "three" ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {stats.map((stat, i) => (
        <StaggerItem key={stat.label} index={startIndex + i}>
          <DashboardStatCard stat={stat} />
        </StaggerItem>
      ))}
    </div>
  );
}
