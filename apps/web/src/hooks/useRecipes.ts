"use client";

import { useCallback } from "react";
import { ApiError } from "../api/client";
import { postRecipes } from "../api/recipes";
import { useAppDispatch, useAppState } from "../store/context";

export function useRecipes() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const fetchRecipes = useCallback(async () => {
    dispatch({ type: "FETCH_RECIPES_START" });
    try {
      const recipes = await postRecipes(state.profile);
      dispatch({ type: "FETCH_RECIPES_SUCCESS", recipes });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Une erreur inattendue est survenue.";
      dispatch({ type: "FETCH_RECIPES_ERROR", errorMessage: message });
    }
  }, [dispatch, state.profile]);

  const toggleSelection = useCallback(
    (recipeId: string) => dispatch({ type: "TOGGLE_RECIPE_SELECTION", recipeId }),
    [dispatch],
  );

  return { ...state, fetchRecipes, toggleSelection };
}
