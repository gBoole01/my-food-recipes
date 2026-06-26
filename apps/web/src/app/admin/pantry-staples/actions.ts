"use server";

import { revalidatePath } from "next/cache";

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
      .catch(() => ({})) as { message?: string };
    return { error: json?.message ?? `Erreur HTTP ${res.status}` };
  }
  return {};
}

export async function addPantryStaple(
  name: string,
): Promise<{ error?: string }> {
  const result = await adminFetch("/api/admin/pantry-staples", "POST", { name });
  if (!result.error) revalidatePath("/admin/pantry-staples");
  return result;
}

export async function removePantryStaple(
  id: string,
): Promise<{ error?: string }> {
  const result = await adminFetch(`/api/admin/pantry-staples/${id}`, "DELETE");
  if (!result.error) revalidatePath("/admin/pantry-staples");
  return result;
}
