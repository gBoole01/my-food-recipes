"use client";

import { useCallback, useEffect, useReducer } from "react";
import type { SeasonalityItem, SeasonalityType } from "@my-food-recipes/contracts";
import { ApiError } from "../api/client";
import { getSeasonalityCatalog } from "../api/catalog";
import type { AsyncStatus } from "../types/domain";

type State = {
  items: SeasonalityItem[];
  type: SeasonalityType | undefined;
  request: AsyncStatus<SeasonalityItem[]>;
};

type Action =
  | { type: "FETCH_START"; filterType: SeasonalityType | undefined }
  | { type: "FETCH_SUCCESS"; items: SeasonalityItem[] }
  | { type: "FETCH_ERROR"; message: string };

const initialState: State = { items: [], type: undefined, request: { state: "idle" } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, type: action.filterType, request: { state: "loading" } };
    case "FETCH_SUCCESS":
      return { ...state, items: action.items, request: { state: "success", data: action.items } };
    case "FETCH_ERROR":
      return { ...state, request: { state: "error", message: action.message } };
  }
}

export function useSeasonality() {
  const [{ items, type, request }, dispatch] = useReducer(reducer, initialState);

  const fetchItems = useCallback(async (nextType: SeasonalityType | undefined) => {
    dispatch({ type: "FETCH_START", filterType: nextType });
    try {
      const result = await getSeasonalityCatalog(nextType);
      dispatch({ type: "FETCH_SUCCESS", items: result.items });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Une erreur inattendue est survenue.";
      dispatch({ type: "FETCH_ERROR", message });
    }
  }, []);

  useEffect(() => {
    if (request.state === "idle") void fetchItems(type);
  }, [request.state, fetchItems, type]);

  const filterByType = useCallback(
    (nextType: SeasonalityType | undefined) => void fetchItems(nextType),
    [fetchItems],
  );

  return { items, type, filterByType, request };
}
