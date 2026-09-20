// components/providers/AuthTransitionProvider.tsx

// Drives the split-screen "doors opening" exit animation on the auth
// layout (login/register). On a successful login, the left (branding)
// panel slides out to the left and the right (form) panel slides out
// to the right before navigating away — instead of an instant route
// change.

"use client";

import { createContext, useContext, useState, useCallback } from "react";

const EXIT_DURATION_MS = 450;

interface AuthTransitionContextType {
  isExiting: boolean;
  triggerExit: (onComplete: () => void) => void;
}

const AuthTransitionContext = createContext<AuthTransitionContextType | null>(null);

export const AuthTransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isExiting, setIsExiting] = useState(false);

  const triggerExit = useCallback((onComplete: () => void) => {
    setIsExiting(true);
    window.setTimeout(onComplete, EXIT_DURATION_MS);
  }, []);

  return (
    <AuthTransitionContext.Provider value={{ isExiting, triggerExit }}>
      {children}
    </AuthTransitionContext.Provider>
  );
};

export const useAuthTransition = (): AuthTransitionContextType => {
  const context = useContext(AuthTransitionContext);
  if (!context) {
    throw new Error("useAuthTransition must be used within an AuthTransitionProvider");
  }
  return context;
};
