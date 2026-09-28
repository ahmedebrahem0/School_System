// components/providers/StoreProvider.tsx

// Redux Store Provider
// Wraps the app with Redux store context
// Must be a Client Component — cannot be in Server Component layout

"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

const StoreProvider = ({ children }: StoreProviderProps) => (
  <Provider store={store}>{children}</Provider>
);

export default StoreProvider;
