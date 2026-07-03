import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  formatCurrency,
  slugify,
  clamp,
} from "./index";

describe("validateEmail", () => {
  it("validates correct emails", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user+tag@domain.co")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validateEmail("@domain.com")).toBe(false);
  });
});

describe("validatePassword", () => {
  it("accepts strong passwords", () => {
    const result = validatePassword("StrongPass1");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects short passwords", () => {
    const result = validatePassword("Ab1");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Password must be at least 8 characters",
    );
  });

  it("rejects passwords without uppercase", () => {
    const result = validatePassword("weakpass1");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must contain an uppercase letter");
  });

  it("rejects passwords without numbers", () => {
    const result = validatePassword("WeakPass");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must contain a number");
  });
});

describe("formatCurrency", () => {
  it("formats cents to dollars", () => {
    expect(formatCurrency(999)).toBe("$9.99");
    expect(formatCurrency(2999)).toBe("$29.99");
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("slugify", () => {
  it("converts text to slugs", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("Multi-tenant SaaS")).toBe("multi-tenant-saas");
  });
});

describe("clamp", () => {
  it("clamps values within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});