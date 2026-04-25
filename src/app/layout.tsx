// app/layout.tsx

// Root layout — wraps the entire application
// Sets up fonts, metadata, providers, and global toast notifications
// Must remain a Server Component — Providers handle client-side needs

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import StoreProvider from "@/components/providers/StoreProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

// ─────────────────────────────────────────────────────
// FONT CONFIGURATION
// Inter — clean, professional font for educational systems
// subsets: ["latin"] — loads only latin characters
// variable — allows using as CSS variable
// ─────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Shows fallback font while Inter loads
});

// ─────────────────────────────────────────────────────
// METADATA
// Used by search engines and browser tabs
// ─────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "EduSystem — School Management",
    template: "%s | EduSystem", // Each page can set its own title
  },
  description: "A comprehensive school management system",
};

// ─────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[#F8FAFC]">

        {/* Redux Store — must wrap everything */}
        <StoreProvider>

          {/* Auth Context — provides user data to all components */}
          <AuthProvider>
            {children}
          </AuthProvider>

        </StoreProvider>

        {/* Toast Notifications — outside providers, needs no context */}
        {/* position: bottom-right matches our design system */}
        {/* richColors: uses semantic colors (green/red/blue) */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={4000}
        />

      </body>
    </html>
  );
};

export default RootLayout;