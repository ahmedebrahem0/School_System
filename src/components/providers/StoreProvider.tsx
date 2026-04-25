// components/providers/StoreProvider.tsx

// Redux Store Provider
// Wraps the app with Redux store context
// Must be a Client Component — cannot be in Server Component layout

"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, store } from "@/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

// useRef instead of direct store import
// Ensures a single store instance  across the app
// Prevents store from being recreated on every render
const StoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
};

export default StoreProvider;