import type {
  EnergyInput,
  EnergyResponse,
  EquipmentPatchRequest,
  Household,
  HouseholdRegistrationRequest,
  MemberInput,
  MemberProfile,
  MemberUpdateRequest,
  PantryPatchRequest,
  RecipeFeedback,
  RecipeFeedbackRequest,
} from "@my-food-recipes/contracts";
import { ApiError, deleteJson, getJson, patchJson, postJson } from "./client";

// Household/member-profile CRUD (EP1.5-1.7) hits the real backend directly:
// USE_MOCKS only covers the legacy chat -> recipes -> shopping-list flow
// (apps/web/src/api/{recipes,shoppingList,chat}.ts), and the point of these
// pages is to view/manage real persisted data, not a mocked stand-in.

export async function getHousehold(): Promise<Household | null> {
  try {
    return await getJson<Household>("/api/profile");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function registerHousehold(input: HouseholdRegistrationRequest): Promise<Household> {
  return postJson<HouseholdRegistrationRequest, Household>("/api/profile", input);
}

export function addMember(input: MemberInput): Promise<MemberProfile> {
  return postJson<MemberInput, MemberProfile>("/api/profile/members", input);
}

export function updateMember(memberId: string, input: MemberUpdateRequest): Promise<MemberProfile> {
  return patchJson<MemberUpdateRequest, MemberProfile>(`/api/profile/members/${memberId}`, input);
}

export function removeMember(memberId: string): Promise<void> {
  return deleteJson(`/api/profile/members/${memberId}`);
}

export function updateEquipment(input: EquipmentPatchRequest): Promise<Household> {
  return patchJson<EquipmentPatchRequest, Household>("/api/profile/equipment", input);
}

export function updatePantry(input: PantryPatchRequest): Promise<Household> {
  return patchJson<PantryPatchRequest, Household>("/api/profile/pantry", input);
}

export function recordFeedback(
  memberId: string,
  input: RecipeFeedbackRequest,
): Promise<RecipeFeedback> {
  return postJson<RecipeFeedbackRequest, RecipeFeedback>(
    `/api/profile/members/${memberId}/feedback`,
    input,
  );
}

export function updateMemberEnergy(
  memberId: string,
  input: EnergyInput,
): Promise<EnergyResponse> {
  return patchJson<EnergyInput, EnergyResponse>(
    `/api/profile/members/${memberId}/energy`,
    input,
  );
}
