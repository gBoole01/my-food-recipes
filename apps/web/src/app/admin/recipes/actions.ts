"use server";

import { revalidatePath } from "next/cache";
import type {
  AdminRecipeCreate,
  AdminRecipeUpdate,
  IngredientAliasSuggestion,
} from "@my-food-recipes/contracts";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
const KEY = process.env.ADMIN_API_KEY ?? "";

async function adminFetch(
  path: string,
  method: string,
  body?: unknown,
): Promise<{ error?: string }> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "X-Admin-Key": KEY,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { error: "Impossible de contacter le serveur." };
  }

  if (res.status === 204) return {};
  if (!res.ok) {
    const json = await res
      .json()
      .catch(() => ({})) as { error?: { message?: string } };
    return { error: json?.error?.message ?? `Erreur HTTP ${res.status}` };
  }
  return {};
}

export async function createRecipe(
  data: AdminRecipeCreate,
): Promise<{ error?: string }> {
  const result = await adminFetch("/api/admin/recipes", "POST", data);
  if (!result.error) revalidatePath("/admin/recipes");
  return result;
}

export async function updateRecipe(
  id: string,
  data: AdminRecipeUpdate,
): Promise<{ error?: string }> {
  const result = await adminFetch(`/api/admin/recipes/${id}`, "PATCH", data);
  if (!result.error) {
    revalidatePath("/admin/recipes");
    revalidatePath(`/admin/recipes/${id}/edit`);
  }
  return result;
}

export async function deleteRecipe(id: string): Promise<{ error?: string }> {
  const result = await adminFetch(`/api/admin/recipes/${id}`, "DELETE");
  if (!result.error) revalidatePath("/admin/recipes");
  return result;
}

export async function searchIngredientAliases(
  search: string,
): Promise<IngredientAliasSuggestion[]> {
  if (search.trim().length < 2) return [];
  try {
    const res = await fetch(
      `${BASE}/api/admin/recipes/ingredient-aliases?search=${encodeURIComponent(search)}`,
      { headers: { "X-Admin-Key": KEY }, cache: "no-store" },
    );
    if (!res.ok) return [];
    return res.json() as Promise<IngredientAliasSuggestion[]>;
  } catch {
    return [];
  }
}
