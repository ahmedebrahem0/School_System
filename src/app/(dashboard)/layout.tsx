// app/(dashboard)/layout.tsx

// Dashboard layout — wraps all dashboard pages
// Combines Sidebar, Header, and MobileNav
// Manages mobile navigation open/close state

"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // Controls mobile navigation drawer open/close
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ─────────────────────────────────────────────
          SIDEBAR
          Fixed left — visible on desktop only
          Hidden on mobile (lg:flex)
          ───────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ─────────────────────────────────────────────
          MOBILE NAVIGATION
          Slide-over drawer — visible on mobile only
          ───────────────────────────────────────────── */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* ─────────────────────────────────────────────
          MAIN CONTENT AREA
          ml-[260px] on desktop to account for sidebar
          Full width on mobile
          ───────────────────────────────────────────── */}
      <div className="lg:ml-[260px]">

        {/* Header — fixed top */}
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />

        {/* Page Content */}
        {/* pt-16 to account for fixed header height */}
        <main className="pt-16 px-6 py-8 lg:px-8">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;