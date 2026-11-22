import type { KimiConfig } from "./client";

/** Dollars per token. */
export type Price = { input: number; cachedInput: number; output: number; source: "numes" | "settings" };

type RichModel = { id: string; pricing?: { prompt?: unknown; input_cache_read?: unknown; completion?: unknown } };

let cache: { key: string; price: Price | null; at: number } | null = null;

/** A per-token USD string from the model list, or null when the host omits the field (missing is not free). */
function usd(v: unknown): number | null {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** The model entries we can read: an `id` string each, with pricing kept as unparsed values for `usd`. */
function modelList(body: unknown): RichModel[] {
  if (!body || typeof body !== "object" || !("data" in body) || !Array.isArray(body.data)) return [];
  return body.data.flatMap((x) => {
    if (!x || typeof x !== "object" || !("id" in x) || typeof x.id !== "string") return [];
    const pricing = "pricing" in x && x.pricing && typeof x.pricing === "object" ? x.pricing : undefined;
    return [{ id: x.id, pricing }];
  });
}

/**
 * Kimi's price, read from Numes's model list (`GET /models`, per-token USD strings), so the run log matches what
 * Numes bills. Falls back to KIMI_PRICE_INPUT / KIMI_PRICE_OUTPUT (dollars per million) when the list can't be read.
 * Cached for an hour.
 */
export async function kimiPrice(c: KimiConfig): Promise<Price | null> {
  if (c.provider !== "numes") return null;
  const key = `${c.baseURL}|${c.model}`;
  if (cache?.key === key && Date.now() - cache.at < 3_600_000) return cache.price;
  let price: Price | null = null;
  try {
    const r = await fetch(new URL("models", c.baseURL.endsWith("/") ? c.baseURL : `${c.baseURL}/`), {
      headers: { Authorization: `Bearer ${c.apiKey}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (r.ok) {
      const list = modelList(await r.json());
      const m = list.find((x) => x.id.toLowerCase() === c.model.toLowerCase());
      const input = usd(m?.pricing?.prompt);
      const output = usd(m?.pricing?.completion);
      // Numes lists some models at 0; that is a real free price, not a missing one.
      if (input !== null && output !== null) price = { input, output, cachedInput: usd(m?.pricing?.input_cache_read) ?? input, source: "numes" };
    }
  } catch {
    /* fall back to settings */
  }
  if (!price && c.price && c.price.input > 0 && c.price.output > 0) price = { input: c.price.input / 1e6, output: c.price.output / 1e6, cachedInput: c.price.input / 1e6, source: "settings" };
  cache = { key, price, at: Date.now() };
  return price;
}

/** Cost of one call. Cached input tokens are part of prompt_tokens and billed at the cached rate. */
export function callCost(price: Price, u: { prompt_tokens: number; completion_tokens: number; cached?: number | null }): number {
  const cached = Math.min(u.cached ?? 0, u.prompt_tokens);
  return (u.prompt_tokens - cached) * price.input + cached * price.cachedInput + u.completion_tokens * price.output;
}
