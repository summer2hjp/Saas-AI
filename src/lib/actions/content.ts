"use server";

import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAdminSession } from "./admin";

/**
 * Fetch public content (visible to all).
 */
export async function getPublicContent(opts: {
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(50, Math.max(1, opts.limit ?? 10));
  const offset = (page - 1) * limit;

  const conditions = and(
    eq(content.visibility, "public"),
    opts.categoryId ? eq(content.categoryId, opts.categoryId) : undefined,
  );

  return db
    .select()
    .from(content)
    .where(conditions)
    .orderBy(desc(content.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Fetch content for a tenant (admin).
 */
export async function getContentByTenant(tenantId: string) {
  await requireAdminSession();
  return db
    .select()
    .from(content)
    .where(eq(content.tenantId, tenantId))
    .orderBy(content.createdAt);
}
