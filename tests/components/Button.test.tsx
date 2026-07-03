import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("renders as link when asChild", () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    );
    const link = screen.getByText("Link");
    expect(link.tagName).toBe("A");
  });
});