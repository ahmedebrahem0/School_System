import { StatCard as BaseStatCard } from "@/components/ui/card";
import type { DashboardStat } from "../types";

interface DashboardStatCardProps {
  stat: DashboardStat;
}

export function DashboardStatCard({ stat }: DashboardStatCardProps) {
  const Icon = stat.icon;

  return (
    <BaseStatCard
      label={stat.label}
      value={stat.value}
      trend={stat.trend}
      trendUp={stat.trendUp}
      icon={<Icon />}
      iconBg={stat.iconBg}
      iconColor={stat.iconColor}
    />
  );
}
