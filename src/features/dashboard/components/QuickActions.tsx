import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StaggerItem } from "@/components/common/StaggerItem";
import type { QuickAction } from "../types";

interface QuickActionsProps {
  title?: string;
  description?: string;
  actions: QuickAction[];
  startIndex?: number;
}

export function QuickActions({
  title = "Quick Actions",
  description = "Common tasks for your role",
  actions,
  startIndex = 0,
}: QuickActionsProps) {
  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {actions.map((action, i) => {
          const Icon = action.icon;

          return (
            <StaggerItem key={action.href} index={startIndex + i}>
              <Button asChild variant="outline" className="w-full">
                <Link href={action.href}>
                  <Icon />
                  {action.label}
                </Link>
              </Button>
            </StaggerItem>
          );
        })}
      </CardContent>
    </Card>
  );
}
