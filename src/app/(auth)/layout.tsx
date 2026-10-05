// app/(auth)/layout.tsx

// Authentication layout — shared between login and register pages
// Split screen design: decorative left panel + form right panel
// No sidebar or header — clean focused experience
//
// On a successful login, AuthTransitionProvider drives an exit
// animation: the left panel slides out to the left and the right
// panel slides out to the right before the route actually changes.

"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { GraduationCap, Users, UserSquare2 } from "lucide-react";
import {
  AuthTransitionProvider,
  useAuthTransition,
} from "@/components/providers/AuthTransitionProvider";
import { cn } from "@/lib/utils/cn";
import styles from "./AuthLayout.module.css";

const AuthLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isExiting } = useAuthTransition();
  const pathname = usePathname();

  return (
    <div className={cn("flex relative", styles.root)}>

      {/* ─────────────────────────────────────────────
          BACKGROUND — school campus photo, full bleed
          ───────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ReDesignLogin.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ─────────────────────────────────────────────
          LEFT — Branding copy over the photo
          Hidden on mobile, visible on lg screens
          ───────────────────────────────────────────── */}
      <div
        className={cn(
          "hidden lg:flex lg:w-[45%] relative z-10 flex-col justify-start p-12",
          styles.brandPanel,
          "transition-all duration-500 ease-in-out",
          !isExiting && "animate-panel-in-left",
          isExiting && "-translate-x-full opacity-0"
        )}
      >
        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center bg-white/85 backdrop-blur-sm rounded-2xl px-3 py-2 w-fit shadow-lg">
            <Image
              src="/logo-school.png"
              alt="EduSystem"
              width={80}
              height={80}
              className="w-20 h-20 object-contain "
              priority
            />
          </div>
        </div>

        {/* Center — Main Text */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight drop-shadow-md">
              Manage your school System              {/* <span className="block text-blue-100">smarter.</span> */}
            </h2>
            <p className="text-white/85 text-base leading-relaxed max-w-sm drop-shadow-sm">
              A comprehensive platform connecting administrators,
              teachers, and students in one unified system.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { value: "1,240", label: "Students", icon: Users,        iconBg: "bg-blue-500",    labelColor: "text-blue-100" },
              { value: "86",    label: "Teachers", icon: UserSquare2, iconBg: "bg-purple-500",  labelColor: "text-purple-100" },
              { value: "42",    label: "Classes",  icon: GraduationCap, iconBg: "bg-emerald-500", labelColor: "text-emerald-100" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="backdrop-blur-2xl rounded-xl p-3 border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] flex items-center gap-2"
                style={{ backgroundColor: "#00000075" }}
              >
                <div className={cn("w-9 h-9 shrink-0 rounded-full flex items-center justify-center", stat.iconBg)}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-lg leading-tight drop-shadow-sm whitespace-nowrap">{stat.value}</p>
                  <p className="text-white text-[11px] font-bold drop-shadow-sm whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Quote */}
        {/* <div className="relative z-10">
          <p className="text-white/60 text-sm drop-shadow-sm">
            © 2026 EduSystem. All rights reserved.
          </p>
        </div> */}
      </div>

      {/* ─────────────────────────────────────────────
          RIGHT PANEL — Form Area (glass card over photo)
          Full width on mobile, 55% on desktop
          ───────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 relative z-10 flex items-center justify-end",
          styles.formPanel,
          "transition-all duration-500 ease-in-out",
          !isExiting && "animate-panel-in-right",
          isExiting && "translate-x-full opacity-0"
        )}
      >
        <div
          key={pathname}
          className={cn("animate-auth-form-in", styles.formViewport)}
        >
          {children}
        </div>
      </div>

    </div>
  );
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthTransitionProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </AuthTransitionProvider>
  );
};

export default AuthLayout;
