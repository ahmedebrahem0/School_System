// features/reports/components/GradeBySubjectChart.tsx

// Bar chart of average grade per subject.

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubjectAverage } from "../types";

interface GradeBySubjectChartProps {
  data: SubjectAverage[];
}

export function GradeBySubjectChart({ data }: GradeBySubjectChartProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-zinc-600">
          Average Grade by Subject
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-400">
            No grades recorded yet.
          </p>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                <XAxis
                  dataKey="subjectName"
                  tick={{ fontSize: 11, fill: "#71717A" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E4E4E7" }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#71717A" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#FAFAFA" }}
                  formatter={(value) => [Number(value).toFixed(1), "Average"]}
                  contentStyle={{
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #E4E4E7",
                  }}
                />
                <Bar
                  dataKey="average"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                  animationDuration={500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
