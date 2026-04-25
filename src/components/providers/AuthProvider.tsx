// components/providers/AuthProvider.tsx

// Authentication Context Provider
// Reads user data from Cookie on initial load
// Provides user data and logout function to all components
// Must be a Client Component

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types/api.types";
import { ROUTES } from "@/constants/routes";

// ─────────────────────────────────────────────────────
// CONTEXT TYPE
// ─────────────────────────────────────────────────────
interface AuthContextType {
  // Current logged in user — null if not authenticated
  user: AuthUser | null;

  // True while reading user from Cookie on initial load
  isLoading: boolean;

  // Updates user state — called after login
  setUser: (user: AuthUser | null) => void;

  // Clears cookies and redirects to login
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────────────
// CREATE CONTEXT
// ─────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ─────────────────────────────────────────────────────
// AUTH PROVIDER
// ─────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─────────────────────────────────────────────────
  // READ USER FROM COOKIE ON INITIAL LOAD
  // Runs once when the app first loads
  // Reads user Cookie set by login Route Handler
  // ─────────────────────────────────────────────────
  useEffect(() => {
    const readUserFromCookie = () => {
      try {
        // Read user cookie — not HttpOnly so JS can read it
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="))
          ?.split("=")[1];

        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie));
          setUser(userData);
        }
      } catch {
        // Cookie is corrupted or invalid — treat as logged out
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    readUserFromCookie();
  }, []);

  // ─────────────────────────────────────────────────
  // LOGOUT
  // Calls logout Route Handler to clear HttpOnly Cookie
  // Then clears user state and redirects to login
  // ─────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────────────
// USE AUTH HOOK
// Custom hook to consume AuthContext
// Throws error if used outside AuthProvider
// ─────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};