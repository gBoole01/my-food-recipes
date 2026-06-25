"use client";

import { useCallback, useEffect, useReducer } from "react";
import type { RecipeInput } from "@my-food-recipes/contracts";
import { ApiError } from "../api/client";
import { getRecipeCatalog } from "../api/catalog";
import type { AsyncStatus } from "../types/domain";

type State = { recipes: RecipeInput[]; request: AsyncStatus<RecipeInput[]> };

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; recipes: RecipeInput[] }
  | { type: "FETCH_ERROR"; message: string };

const initialState: State = { recipes: [], request: { state: "idle" } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, request: { state: "loading" } };
    case "FETCH_SUCCESS":
      return { recipes: action.recipes, request: { state: "success", data: action.recipes } };
    case "FETCH_ERROR":
      return { ...state, request: { state: "error", message: action.message } };
  }
}

export function useRecipeCatalog() {
  const [{ recipes, request }, dispatch] = useReducer(reducer, initialState);

  const fetchCatalog = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const { recipes: result } = await getRecipeCatalog();
      dispatch({ type: "FETCH_SUCCESS", recipes: result });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Une erreur inattendue est survenue.";
      dispatch({ type: "FETCH_ERROR", message });
    }
  }, []);

  useEffect(() => {
    if (request.state === "idle") void fetchCatalog();
  }, [request.state, fetchCatalog]);

  return { recipes, request, fetchCatalog };
}
