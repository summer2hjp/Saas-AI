import { describe, it, expect } from "vitest";
import {
  getPermissionLevel,
  canManageContent,
  canManageUsers,
  canViewAdmin,
} from "@/lib/permissions";

describe("getPermissionLevel", () => {
  it("returns correct levels", () => {
    expect(getPermissionLevel("super_admin")).toBe(100);
    expect(getPermissionLevel("admin")).toBe(80);
    expect(getPermissionLevel("member")).toBe(40);
    expect(getPermissionLevel("viewer")).toBe(10);
    expect(getPermissionLevel("unknown")).toBe(0);
  });
});

describe("permission checks", () => {
  it("allows admin to manage content and users", () => {
    expect(canManageContent("admin")).toBe(true);
    expect(canManageUsers("admin")).toBe(true);
    expect(canViewAdmin("admin")).toBe(true);
  });

  it("denies member from managing content", () => {
    expect(canManageContent("member")).toBe(false);
    expect(canManageUsers("member")).toBe(false);
    expect(canViewAdmin("member")).toBe(false);
  });
});