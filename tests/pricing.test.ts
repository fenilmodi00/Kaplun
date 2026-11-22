import { afterEach, describe, expect, it, vi } from "vitest";
import { callCost, kimiPrice } from "@/lib/kimi/pricing";
import { kimiConfig } from "@/lib/kimi/client";

const cfg = (base: string, extra: Record<string, string> = {}) =>
  kimiConfig({ KIMI_BASE_URL: base, NUMES_API_KEY: "x", ...extra } as unknown as NodeJS.ProcessEnv);

describe("Numes pricing", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("bills cached input at the cached rate and the rest at the normal rate", () => {
    const price = { input: 1e-6, cachedInput: 0.1e-6, output: 4e-6, source: "numes" as const };
    // 1,000 input of which 400 cached, 2,000 output
    expect(callCost(price, { prompt_tokens: 1000, completion_tokens: 2000, cached: 400 })).toBeCloseTo(600e-6 + 40e-6 + 8000e-6, 12);
  });

  it("reads the model's per-token price from the model list", async () => {
    vi.stubGlobal("fetch", async () =>
      new Response(JSON.stringify({ data: [{ id: "moonshotai/kimi-k3.1-pro", pricing: { prompt: "0.000002", completion: "0.00001", input_cache_read: "0.0000002" } }] })),
    );
    expect(await kimiPrice(cfg("https://priced.example/v1/"))).toEqual({ input: 2e-6, cachedInput: 0.2e-6, output: 1e-5, source: "numes" });
  });

  it("treats a listed zero as free, but a missing price as unknown", async () => {
    const free = cfg("https://free.example/v1/");
    const gone = cfg("https://gone.example/v1/");
    vi.stubGlobal("fetch", async (url: unknown) =>
      new Response(
        JSON.stringify({ data: String(url).includes("free") ? [{ id: "moonshotai/kimi-k3.1-pro", pricing: { prompt: "0", completion: "0", input_cache_read: "0" } }] : [{ id: "moonshotai/kimi-k3.1-pro" }] }),
      ),
    );
    expect(await kimiPrice(free)).toEqual({ input: 0, cachedInput: 0, output: 0, source: "numes" });
    expect(await kimiPrice(gone)).toBeNull();
  });

  it("uses the price from settings when the model list can't be read", async () => {
    const c = cfg("http://127.0.0.1:9/v1/", { KIMI_PRICE_INPUT: "2", KIMI_PRICE_OUTPUT: "8" });
    const p = await kimiPrice(c);
    expect(p).toMatchObject({ input: 2e-6, output: 8e-6, source: "settings" });
  });

  it("has no price in replay mode", async () => {
    expect(await kimiPrice(kimiConfig({ KIMI_PROVIDER: "replay" } as unknown as NodeJS.ProcessEnv))).toBeNull();
  });
});
