// features/reports/components/AttendanceStatusChart.tsx

// Donut chart breaking down attendance records by status.

"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttendanceReportStats } from "../types";

const COLORS = {
  Present: "#10B981",
  Late: "#F59E0B",
  Absent: "#EF4444",
};

interface AttendanceStatusChartProps {
  stats: AttendanceReportStats;
}

export function AttendanceStatusChart({ stats }: AttendanceStatusChartProps) {
  const data = [
    { name: "Present", value: stats.present },
    { name: "Late", value: stats.late },
    { name: "Absent", value: stats.absent },
  ].filter((entry) => entry.value > 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-zinc-600">
          Attendance Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-400">
            No attendance records yet.
          </p>
        ) : (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  animationDuration={500}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #E4E4E7",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-2 flex items-center justify-center gap-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-600">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
              />
              {entry.name} ({entry.value})
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
