// app/(auth)/layout.tsx

// Authentication layout — shared between login and register pages
// Split screen design: decorative left panel + form right panel
// No sidebar or header — clean focused experience

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Auth | EduSystem",
    template: "%s | EduSystem",
  },
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">

      {/* ─────────────────────────────────────────────
          LEFT PANEL — Decorative
          Hidden on mobile, visible on lg screens
          ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#1E3A8A] relative overflow-hidden flex-col justify-between p-12">

        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circle top right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          {/* Medium circle bottom left */}
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5" />
          {/* Small circle center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-lg">EduSystem</p>
              <p className="text-white/50 text-xs">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Center — Main Text */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Manage your school
              <span className="block text-white/60">smarter.</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              A comprehensive platform connecting administrators,
              teachers, and students in one unified system.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "1,240", label: "Students" },
              { value: "86",    label: "Teachers" },
              { value: "42",    label: "Classes"  },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-white/60 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Quote */}
        <div className="relative z-10">
          <p className="text-white/40 text-sm">
            © 2025 EduSystem. All rights reserved.
          </p>
        </div>

      </div>

      {/* ─────────────────────────────────────────────
          RIGHT PANEL — Form Area
          Full width on mobile, 55% on desktop
          ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
