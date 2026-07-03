"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get the current session (server-side).
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return { ok: true, data: session };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to get session",
    };
  }
}

/**
 * Sign out the current user (server-side).
 */
export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to sign out",
    };
  }
}