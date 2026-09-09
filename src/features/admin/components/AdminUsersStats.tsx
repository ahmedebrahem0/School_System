"use client";

import { Shield, UserCheck, UserCog, UserRound, Users } from "lucide-react";
import { StatCard } from "@/components/ui/card";
import { ROLES } from "@/constants/roles";
import type { AdminUser } from "../types";

interface AdminUsersStatsProps {
  users: AdminUser[];
  pendingCount?: number;
}

export function AdminUsersStats({ users, pendingCount }: AdminUsersStatsProps) {
  const admins = users.filter((user) => user.roles.includes(ROLES.ADMIN)).length;
  const teachers = users.filter((user) =>
    user.roles.includes(ROLES.TEACHER)
  ).length;
  const students = users.filter((user) =>
    user.roles.includes(ROLES.STUDENT)
  ).length;
  const pending =
    pendingCount ?? users.filter((user) => user.roles.length === 0).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Total users"
        value={users.length}
        icon={<Users />}
        iconBg="#DBEAFE"
        iconColor="#1E3A8A"
      />
      <StatCard
        label="Admins"
        value={admins}
        icon={<Shield />}
        iconBg="#E0E7FF"
        iconColor="#4338CA"
      />
      <StatCard
        label="Teachers"
        value={teachers}
        icon={<UserCog />}
        iconBg="#CCFBF1"
        iconColor="#0F766E"
      />
      <StatCard
        label="Students"
        value={students}
        icon={<UserRound />}
        iconBg="#DBEAFE"
        iconColor="#2563EB"
      />
      <StatCard
        label="Pending"
        value={pending}
        icon={<UserCheck />}
        iconBg="#FEF3C7"
        iconColor="#B45309"
      />
    </div>
  );
}
