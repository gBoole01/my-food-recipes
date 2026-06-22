const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Impossible de contacter le serveur. Vérifiez votre connexion.");
  }
  if (!res.ok) {
    throw new ApiError(`Erreur serveur (${res.status}). Veuillez réessayer.`, res.status);
  }
  return res.json() as Promise<TRes>;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
