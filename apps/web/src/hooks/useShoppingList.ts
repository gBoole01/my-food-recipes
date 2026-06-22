"use client";

import { useCallback } from "react";
import { ApiError } from "../api/client";
import { postShoppingList } from "../api/shoppingList";
import { useAppDispatch, useAppState } from "../store/context";

export function useShoppingList() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const runRequest = useCallback(
    async (guestCount: number) => {
      dispatch({ type: "FETCH_SHOPPING_LIST_START" });
      try {
        const groups = await postShoppingList(Array.from(state.selectedRecipeIds), guestCount);
        dispatch({ type: "FETCH_SHOPPING_LIST_SUCCESS", groups });
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Une erreur inattendue est survenue.";
        dispatch({ type: "FETCH_SHOPPING_LIST_ERROR", errorMessage: message });
      }
    },
    [dispatch, state.selectedRecipeIds],
  );

  const generateList = useCallback(
    () => runRequest(state.profile.guestCount ?? 2),
    [runRequest, state.profile.guestCount],
  );

  const adjustGuestCount = useCallback(
    (delta: number) => {
      const nextGuestCount = Math.max(1, Math.min(12, (state.profile.guestCount ?? 2) + delta));
      dispatch({ type: "SET_GUEST_COUNT", guestCount: nextGuestCount });
      void runRequest(nextGuestCount);
    },
    [dispatch, runRequest, state.profile.guestCount],
  );

  const toggleItem = useCallback(
    (itemId: string) => dispatch({ type: "TOGGLE_ITEM_CHECKED", itemId }),
    [dispatch],
  );

  return { ...state, generateList, adjustGuestCount, toggleItem };
}
