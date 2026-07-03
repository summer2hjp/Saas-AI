import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders and forwards value", () => {
    render(<Input placeholder="Enter email" value="test@example.com" readOnly />);
    const input = screen.getByPlaceholderText("Enter email") as HTMLInputElement;
    expect(input.value).toBe("test@example.com");
  });

  it("applies disabled state", () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText("Disabled input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});