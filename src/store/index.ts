// store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";

// ─────────────────────────────────────────────────────
// CONFIGURE STORE
// ─────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },

  // ─────────────────────────────────────────────────
  // MIDDLEWARE
  //   - الـ Cache lifecycle
  //   - الـ invalidation
  //   - الـ polling
  //   - الـ prefetching
  //
  // لو منضيفوش → الـ Cache والـ invalidation مش هيشتغلوا
  // ─────────────────────────────────────────────────
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// ─────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;