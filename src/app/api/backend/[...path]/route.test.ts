import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const cookieGet = vi.fn(() => ({ value: "server-cookie-token" }));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ get: cookieGet })),
}));

describe("backend proxy", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://backend.test";
  });

  it("forwards the idempotency key without forwarding arbitrary headers", async () => {
    const backendFetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { "content-type": "application/json" },
      })
    );
    const { POST } = await import("./route");
    const request = new NextRequest("http://localhost/api/backend/api/Notifications/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": "operation-key-1",
        "x-unsafe-header": "must-not-pass",
      },
      body: JSON.stringify({ title: "Test" }),
    });

    await POST(request, {
      params: Promise.resolve({ path: ["api", "Notifications", "send"] }),
    });

    const [, options] = backendFetch.mock.calls[0];
    const headers = options?.headers as Headers;
    expect(headers.get("authorization")).toBe("Bearer server-cookie-token");
    expect(headers.get("idempotency-key")).toBe("operation-key-1");
    expect(headers.get("x-unsafe-header")).toBeNull();
  });
});
