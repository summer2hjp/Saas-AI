import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * Get the current tenant ID from the session.
 * Uses React cache to avoid redundant session lookups within a single render.
 */
export const getTenantId = cache(async (): Promise<string | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.tenantId ?? null;
  } catch {
    return null;
  }
});

/**
 * Get the current user's role from the session.
 */
export const getUserRole = cache(async (): Promise<string | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.role ?? null;
  } catch {
    return null;
  }
});

export function requireAdmin(role: string): void {
  if (role !== "super_admin" && role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
}

export function getPermissionLevel(role: string): number {
  const levels: Record<string, number> = {
    super_admin: 100,
    admin: 80,
    member: 40,
    viewer: 10,
  };
  return levels[role] ?? 0;
}

export function canManageContent(role: string): boolean {
  return getPermissionLevel(role) >= 80;
}

export function canManageUsers(role: string): boolean {
  return getPermissionLevel(role) >= 80;
}

export function canViewAdmin(role: string): boolean {
  return getPermissionLevel(role) >= 80;
}
