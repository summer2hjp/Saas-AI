import { describe, it, expect } from "vitest";
import { sanitizeHtml, validatePagination } from "@/lib/security";

describe("sanitizeHtml", () => {
  it("escapes HTML characters", () => {
    expect(sanitizeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;",
    );
    expect(sanitizeHtml('"test"')).toBe("&quot;test&quot;");
  });
});

describe("validatePagination", () => {
  it("validates page and limit", () => {
    const result = validatePagination(1, 20);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
  });

  it("clamps to valid range", () => {
    expect(validatePagination(0, 200).page).toBe(1);
    expect(validatePagination(1, 200).limit).toBe(100);
    expect(validatePagination(-5, -1).limit).toBe(1);
  });
});