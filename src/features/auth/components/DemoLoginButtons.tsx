// features/auth/components/DemoLoginButtons.tsx

// One-click demo logins for portfolio/reviewer visitors — fills and
// submits the login form with fixed seeded accounts so anyone can try
// each role without needing real credentials.

"use client";

import { Shield, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { LoginFormData } from "../types";

interface DemoAccount {
  label: string;
  icon: typeof Shield;
  credentials: LoginFormData;
  accentClass: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Admin",
    icon: Shield,
    credentials: { userNameOrEmail: "admin@school.com", password: "Admin@123!" },
    accentClass: "text-indigo-600 border-indigo-200 hover:bg-indigo-50",
  },
  {
    label: "Teacher",
    icon: Users,
    credentials: { userNameOrEmail: "teacher@gmail.com", password: "Teacher@123" },
    accentClass: "text-teal-600 border-teal-200 hover:bg-teal-50",
  },
  {
    label: "Student",
    icon: GraduationCap,
    credentials: { userNameOrEmail: "student@gmail.com", password: "Student@123" },
    accentClass: "text-blue-600 border-blue-200 hover:bg-blue-50",
  },
];

interface DemoLoginButtonsProps {
  onSelect: (credentials: LoginFormData) => void;
  disabled?: boolean;
}

export function DemoLoginButtons({ onSelect, disabled }: DemoLoginButtonsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Just browsing? Try a demo account
        </p>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <Button
            key={account.label}
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onSelect(account.credentials)}
            className={cn(
              "h-auto flex-col gap-1.5 py-3 bg-white",
              account.accentClass
            )}
          >
            <account.icon className="w-4 h-4" />
            <span className="text-[12px] font-medium">{account.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
