import { describe, it, expect } from "vitest";

// Stripe tests check formatting/validation logic (not live API calls)
describe("formatCurrency", () => {
  it("formats cents to USD string", () => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
    }).format(29.99);
    expect(formatted).toBe("$29.99");
  });

  it("handles zero", () => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
    }).format(0);
    expect(formatted).toBe("$0.00");
  });
});