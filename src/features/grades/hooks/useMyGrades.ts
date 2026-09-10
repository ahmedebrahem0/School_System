import { useMemo } from "react";
import { useGetMyGradesQuery } from "../api";
import type { Grade } from "../types";

export interface GradeSummary {
  total: number;
  average: number;
  highest: number;
  passing: number;
  failing: number;
}

export const summarizeGrades = (grades: Grade[]): GradeSummary => {
  if (grades.length === 0) {
    return {
      total: 0,
      average: 0,
      highest: 0,
      passing: 0,
      failing: 0,
    };
  }

  const totalScore = grades.reduce((sum, item) => sum + item.grade, 0);
  const passing = grades.filter((item) => item.grade >= 50).length;

  return {
    total: grades.length,
    average: Math.round((totalScore / grades.length) * 10) / 10,
    highest: Math.max(...grades.map((item) => item.grade)),
    passing,
    failing: grades.length - passing,
  };
};

export const useMyGrades = () => {
  const query = useGetMyGradesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const grades = useMemo(() => query.data ?? [], [query.data]);
  const summary = useMemo(() => summarizeGrades(grades), [grades]);

  return {
    ...query,
    grades,
    summary,
  };
};
