"use client";

import { Badge } from "@/components/ui/badge";

interface GradeBadgeProps {
  grade: number;
  showLabel?: boolean;
}

const getGradeTone = (grade: number) => {
  if (grade >= 85) return { variant: "success" as const, label: "Excellent" };
  if (grade >= 70) return { variant: "primary" as const, label: "Strong" };
  if (grade >= 50) return { variant: "warning" as const, label: "Pass" };
  return { variant: "danger" as const, label: "Needs support" };
};

export function GradeBadge({ grade, showLabel = true }: GradeBadgeProps) {
  const tone = getGradeTone(grade);

  return (
    <Badge variant={tone.variant} dot>
      {grade}
      {showLabel ? ` - ${tone.label}` : ""}
    </Badge>
  );
}
