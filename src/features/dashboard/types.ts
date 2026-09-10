import type { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}

export interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface ActivityItem {
  label: string;
  value: string | number;
  tone?: "blue" | "teal" | "amber" | "emerald" | "red" | "indigo";
}
