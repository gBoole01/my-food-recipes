"use client";

import { useCallback, useEffect, useReducer } from "react";
import type { FoodNutritionSummary } from "@my-food-recipes/contracts";
import { ApiError } from "../api/client";
import { getNutritionCatalog } from "../api/catalog";
import type { AsyncStatus } from "../types/domain";

type State = {
  items: FoodNutritionSummary[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  request: AsyncStatus<FoodNutritionSummary[]>;
};

type Action =
  | { type: "FETCH_START"; search: string }
  | { type: "FETCH_SUCCESS"; items: FoodNutritionSummary[]; total: number; page: number; pageSize: number }
  | { type: "FETCH_ERROR"; message: string };

const initialState: State = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 25,
  search: "",
  request: { state: "idle" },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, search: action.search, request: { state: "loading" } };
    case "FETCH_SUCCESS":
      return {
        ...state,
        items: action.items,
        total: action.total,
        page: action.page,
        pageSize: action.pageSize,
        request: { state: "success", data: action.items },
      };
    case "FETCH_ERROR":
      return { ...state, request: { state: "error", message: action.message } };
  }
}

export function useNutritionCatalog() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchPage = useCallback(async (nextPage: number, nextSearch: string) => {
    dispatch({ type: "FETCH_START", search: nextSearch });
    try {
      const result = await getNutritionCatalog({ page: nextPage, search: nextSearch || undefined });
      dispatch({
        type: "FETCH_SUCCESS",
        items: result.items,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Une erreur inattendue est survenue.";
      dispatch({ type: "FETCH_ERROR", message });
    }
  }, []);

  useEffect(() => {
    if (state.request.state === "idle") void fetchPage(1, "");
  }, [state.request.state, fetchPage]);

  const runSearch = useCallback(
    (value: string) => void fetchPage(1, value),
    [fetchPage],
  );

  const goToPage = useCallback(
    (nextPage: number) => void fetchPage(nextPage, state.search),
    [fetchPage, state.search],
  );

  return { ...state, runSearch, goToPage };
}
