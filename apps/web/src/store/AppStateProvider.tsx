"use client";

import { useReducer } from "react";
import type { ReactNode } from "react";
import { appReducer } from "./appReducer";
import { initialState } from "./appState";
import { AppDispatchCtx, AppStateCtx } from "./context";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppStateCtx.Provider value={state}>
      <AppDispatchCtx.Provider value={dispatch}>{children}</AppDispatchCtx.Provider>
    </AppStateCtx.Provider>
  );
}
