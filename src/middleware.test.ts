import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("system map public access", () => {
  it.each([undefined, "Admin", "Teacher", "Student"])(
    "allows the map for %s without an authentication redirect",
    (role) => {
      const request = new NextRequest("http://localhost/system-map");
      if (role) {
        request.cookies.set("token", "test-session");
        request.cookies.set(
          "user",
          encodeURIComponent(JSON.stringify({ role })),
        );
      }
      const response = middleware(request);
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-next")).toBe("1");
    },
  );

  it("still sends anonymous dashboard visitors to login", () => {
    const response = middleware(new NextRequest("http://localhost/dashboard"));
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?callbackUrl=%2Fdashboard",
    );
  });

  it("keeps the normal signed-in login redirect", () => {
    const request = new NextRequest("http://localhost/login");
    request.cookies.set("token", "test-session");
    const response = middleware(request);
    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
  });

  it("does not allow adjacent paths through the map exception", () => {
    const response = middleware(
      new NextRequest("http://localhost/system-map-private"),
    );
    expect(response.headers.get("location")).toContain("/login?");
  });
});
