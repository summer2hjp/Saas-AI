import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type AdminRole = "super_admin" | "admin";

/**
 * Require an authenticated admin session.
 * Returns the session + user if authorized, or throws a redirect-compatible error.
 * Use in API routes: `const { user } = await requireAdmin();`
 */
export async function requireAdmin(): Promise<{
  user: { id: string; role: AdminRole; tenantId: string; email: string };
  session: { id: string };
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized: not authenticated");
  }

  const role = session.user.role as string;
  if (role !== "super_admin" && role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }

  return {
    user: {
      id: session.user.id,
      role: session.user.role as AdminRole,
      tenantId: session.user.tenantId,
      email: session.user.email,
    },
    session: { id: session.session.id },
  };
}

/**
 * Require an authenticated session (any role).
 * Returns the session + user if authenticated.
 */
export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized: not authenticated");
  }

  return {
    user: {
      id: session.user.id,
      role: session.user.role as string,
      tenantId: session.user.tenantId,
      email: session.user.email,
    },
    session: { id: session.session.id },
  };
}
