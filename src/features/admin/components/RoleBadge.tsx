"use client";

import { Badge } from "@/components/ui/badge";
import { ROLE_META, ROLES, type Role } from "@/constants/roles";

interface RoleBadgeProps {
  role?: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (!role) {
    return (
      <Badge variant="warning" dot>
        Pending
      </Badge>
    );
  }

  const variant =
    role === ROLES.ADMIN ? "admin" : role === ROLES.TEACHER ? "teacher" : "student";

  return (
    <Badge variant={variant} dot>
      {ROLE_META[role].label}
    </Badge>
  );
}
