"use client";

import { useCallback, useEffect, useReducer } from "react";
import type {
  EquipmentPatchRequest,
  Household,
  HouseholdRegistrationRequest,
  MemberInput,
  MemberUpdateRequest,
  PantryPatchRequest,
} from "@my-food-recipes/contracts";
import { ApiError } from "../api/client";
import * as profileApi from "../api/profile";
import type { AsyncStatus } from "../types/domain";

type State = { household: Household | null; request: AsyncStatus<Household | null> };

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; household: Household | null }
  | { type: "FETCH_ERROR"; message: string };

const initialState: State = { household: null, request: { state: "idle" } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, request: { state: "loading" } };
    case "FETCH_SUCCESS":
      return { household: action.household, request: { state: "success", data: action.household } };
    case "FETCH_ERROR":
      return { ...state, request: { state: "error", message: action.message } };
  }
}

export function useHousehold() {
  const [{ household, request }, dispatch] = useReducer(reducer, initialState);

  const load = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const result = await profileApi.getHousehold();
      dispatch({ type: "FETCH_SUCCESS", household: result });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Une erreur inattendue est survenue.";
      dispatch({ type: "FETCH_ERROR", message });
    }
  }, []);

  useEffect(() => {
    if (request.state === "idle") void load();
  }, [request.state, load]);

  const register = useCallback(async (input: HouseholdRegistrationRequest) => {
    const result = await profileApi.registerHousehold(input);
    dispatch({ type: "FETCH_SUCCESS", household: result });
    return result;
  }, []);

  const addMember = useCallback(
    async (input: MemberInput) => {
      await profileApi.addMember(input);
      await load();
    },
    [load],
  );

  const updateMember = useCallback(
    async (memberId: string, input: MemberUpdateRequest) => {
      await profileApi.updateMember(memberId, input);
      await load();
    },
    [load],
  );

  const removeMember = useCallback(
    async (memberId: string) => {
      await profileApi.removeMember(memberId);
      await load();
    },
    [load],
  );

  const updateEquipment = useCallback(async (input: EquipmentPatchRequest) => {
    const result = await profileApi.updateEquipment(input);
    dispatch({ type: "FETCH_SUCCESS", household: result });
  }, []);

  const updatePantry = useCallback(async (input: PantryPatchRequest) => {
    const result = await profileApi.updatePantry(input);
    dispatch({ type: "FETCH_SUCCESS", household: result });
  }, []);

  return {
    household,
    request,
    reload: load,
    register,
    addMember,
    updateMember,
    removeMember,
    updateEquipment,
    updatePantry,
  };
}
