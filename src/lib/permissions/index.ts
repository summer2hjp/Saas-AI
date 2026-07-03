export function getTenantId(): string | null {
  // In a real app this reads from the session/context
  // Placeholder — will be populated by middleware
  return null;
}

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