"use client";

import { Award, BookOpenCheck, TrendingDown, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui/card";
import type { Grade } from "../types";
import { summarizeGrades } from "../hooks/useMyGrades";

interface GradeStatsProps {
  grades: Grade[];
}

export function GradeStats({ grades }: GradeStatsProps) {
  const summary = summarizeGrades(grades);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Recorded grades"
        value={summary.total}
        icon={<BookOpenCheck />}
        iconBg="#DBEAFE"
        iconColor="#1E3A8A"
      />
      <StatCard
        label="Average score"
        value={summary.total ? `${summary.average}%` : "0%"}
        icon={<Award />}
        iconBg="#CCFBF1"
        iconColor="#0F766E"
      />
      <StatCard
        label="Passing"
        value={summary.passing}
        icon={<TrendingUp />}
        iconBg="#D1FAE5"
        iconColor="#047857"
      />
      <StatCard
        label="Needs support"
        value={summary.failing}
        icon={<TrendingDown />}
        iconBg="#FEE2E2"
        iconColor="#B91C1C"
      />
    </div>
  );
}
