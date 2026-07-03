"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, plans, content, files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

function getAdminUser(user: { role: string }): void {
  if (user.role !== "super_admin" && user.role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
}

async function requireAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");
  getAdminUser(session.user);
  return session;
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function getUsers(tenantId: string) {
  await requireAdminSession();
  return db.select().from(users).where(eq(users.tenantId, tenantId));
}

export async function updateUserRole(id: string, role: string) {
  await requireAdminSession();
  const [updated] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, id))
    .returning();
  return updated;
}

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function getPlans() {
  await requireAdminSession();
  return db
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(plans.sortOrder);
}

export async function createPlan(data: {
  name: string;
  description?: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}) {
  await requireAdminSession();
  const [plan] = await db.insert(plans).values(data).returning();
  return plan;
}

export async function updatePlan(id: string, data: Record<string, unknown>) {
  await requireAdminSession();
  const [updated] = await db
    .update(plans)
    .set(data)
    .where(eq(plans.id, id))
    .returning();
  return updated;
}

// ─── Content ─────────────────────────────────────────────────────────────────

export async function getContent(tenantId: string) {
  await requireAdminSession();
  return db
    .select()
    .from(content)
    .where(eq(content.tenantId, tenantId))
    .orderBy(content.createdAt);
}

export async function createContent(data: {
  tenantId: string;
  title: string;
  slug: string;
  body: string;
  authorId: string;
  visibility?: "public" | "logged_in" | "subscriber" | "paywalled";
}) {
  await requireAdminSession();
  const [post] = await db.insert(content).values(data).returning();
  return post;
}

// ─── Files ───────────────────────────────────────────────────────────────────

export async function deleteFileRecord(id: string, key?: string) {
  await requireAdminSession();
  if (key) {
    const { deleteFile } = await import("@/lib/r2");
    await deleteFile(key);
  }
  await db.delete(files).where(eq(files.id, id));
  return { deleted: true };
}
