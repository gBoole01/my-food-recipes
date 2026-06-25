const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function request<TRes>(path: string, init?: RequestInit): Promise<TRes> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch {
    throw new ApiError("Impossible de contacter le serveur. Vérifiez votre connexion.");
  }
  if (!res.ok) {
    throw new ApiError(`Erreur serveur (${res.status}). Veuillez réessayer.`, res.status);
  }
  if (res.status === 204) return undefined as TRes;
  return res.json() as Promise<TRes>;
}

export function getJson<TRes>(path: string): Promise<TRes> {
  return request<TRes>(path);
}

export function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  return request<TRes>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function patchJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  return request<TRes>(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteJson(path: string): Promise<void> {
  return request<void>(path, { method: "DELETE" });
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
