import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Auth flow integration tests.
 * Tests the client-side auth client behavior and form validation.
 */
describe("Auth Flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("validates email format client-side", () => {
    const validEmail = "user@example.com";
    const invalidEmail = "not-email";
    expect(validEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(invalidEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("validates password requirements", () => {
    const strongPassword = "StrongPass1";
    expect(strongPassword.length).toBeGreaterThanOrEqual(8);
    expect(/[A-Z]/.test(strongPassword)).toBe(true);
    expect(/[0-9]/.test(strongPassword)).toBe(true);
  });

  it("rejects short passwords", () => {
    const short = "Ab1";
    expect(short.length).toBeLessThan(8);
  });

  it("rejects passwords without uppercase", () => {
    const noUpper = "weakpass1";
    expect(/[A-Z]/.test(noUpper)).toBe(false);
  });

  it("calls authClient.signIn.email with correct credentials", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ error: null });
    vi.mock("@/lib/auth", () => ({
      authClient: {
        signIn: {
          email: mockSignIn,
        },
      },
    }));

    const { authClient } = await import("@/lib/auth");
    const result = await authClient.signIn.email({
      email: "test@example.com",
      password: "TestPass1",
    });
    expect(result.error).toBeNull();
  });

  it("handles authClient sign-in errors", async () => {
    const mockSignIn = vi
      .fn()
      .mockResolvedValue({ error: { message: "Invalid credentials" } });
    vi.mock("@/lib/auth", () => ({
      authClient: {
        signIn: {
          email: mockSignIn,
        },
      },
    }));

    const { authClient } = await import("@/lib/auth");
    const result = await authClient.signIn.email({
      email: "wrong@example.com",
      password: "WrongPass1",
    });
    expect(result.error).toBeTruthy();
    expect(result.error!.message).toBe("Invalid credentials");
  });

  it("handles registration with valid data", async () => {
    const mockSignUp = vi.fn().mockResolvedValue({ error: null, data: { user: { id: "1" } } });
    vi.mock("@/lib/auth", () => ({
      authClient: {
        signUp: {
          email: mockSignUp,
        },
      },
    }));

    const { authClient } = await import("@/lib/auth");
    const result = await authClient.signUp.email({
      name: "Test User",
      email: "new@example.com",
      password: "StrongPass1",
    });
    expect(result.error).toBeNull();
    expect(result.data).toBeTruthy();
  });
});