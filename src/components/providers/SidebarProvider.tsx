// components/providers/SidebarProvider.tsx

// Sidebar collapse state — shared between Sidebar, Header, and the
// dashboard layout so they can all react to the same collapsed/expanded
// value. Persisted to localStorage as a per-browser convenience only.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const STORAGE_KEY = "sidebar-collapsed";

interface SidebarContextType {
  isCollapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setIsCollapsed(true);
    } catch {
      // localStorage unavailable — fall back to expanded
    }
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore write failures (private mode, blocked storage, etc.)
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
