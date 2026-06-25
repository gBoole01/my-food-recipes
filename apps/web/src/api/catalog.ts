import type {
  FoodNutritionListResponse,
  RecipeCatalogResponse,
  SeasonalityListResponse,
  SeasonalityType,
} from "@my-food-recipes/contracts";
import { getJson } from "./client";

// Seeded-data browsing endpoints — same rationale as api/profile.ts, these
// always hit the real backend since the point is to inspect real seed data.

export function getRecipeCatalog(): Promise<RecipeCatalogResponse> {
  return getJson<RecipeCatalogResponse>("/api/recipes/catalog");
}

export function getNutritionCatalog(params: {
  search?: string;
  page?: number;
}): Promise<FoodNutritionListResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  const qs = query.toString();
  return getJson<FoodNutritionListResponse>(`/api/nutrition${qs ? `?${qs}` : ""}`);
}

export function getSeasonalityCatalog(type?: SeasonalityType): Promise<SeasonalityListResponse> {
  const qs = type ? `?type=${type}` : "";
  return getJson<SeasonalityListResponse>(`/api/seasonality${qs}`);
}
