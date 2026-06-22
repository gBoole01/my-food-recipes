"use client";

import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { AppAction } from "./appReducer";
import type { AppState } from "./appState";

export const AppStateCtx = createContext<AppState | null>(null);
export const AppDispatchCtx = createContext<Dispatch<AppAction> | null>(null);

export function useAppState(): AppState {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function useAppDispatch(): Dispatch<AppAction> {
  const ctx = useContext(AppDispatchCtx);
  if (!ctx) throw new Error("useAppDispatch must be used within AppStateProvider");
  return ctx;
}
