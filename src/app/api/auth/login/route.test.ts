import { describe, expect, it } from "vitest";
import { toAuthUser } from "@/features/auth/auth-user";

const adminToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsIlVzZXJJZCI6ImFkbWluLWlkIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4ifQ.signature";

describe("auth login response mapping", () => {
  it("maps the active admin response returned by the backend", () => {
    expect(
      toAuthUser({ token: adminToken, roleStatus: "Active", role: "Admin" })
    ).toEqual({
      id: "admin-id",
      userName: "admin",
      fullName: "admin",
      email: "",
      gender: "",
      role: "Admin",
    });
  });

  it("supports a standard role claim when the backend omits role", () => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZWFjaGVyIiwicm9sZSI6IlRlYWNoZXIifQ.signature";

    expect(
      toAuthUser({ token, roleStatus: "Active", role: "" })
    ).toMatchObject({ userName: "teacher", role: "Teacher" });
  });

  it("returns null instead of creating an unauthorizable user", () => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.signature";
    expect(
      toAuthUser({ token, roleStatus: "Active", role: "Unknown" })
    ).toBeNull();
  });
});
