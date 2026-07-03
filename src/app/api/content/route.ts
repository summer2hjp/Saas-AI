import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { eq, like, desc, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { z } from "zod";

const createSchema = z.object({
  tenantId: z.string().uuid(),
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  body: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  visibility: z
    .enum(["public", "logged_in", "subscriber", "paywalled"])
    .default("public"),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const visibility = searchParams.get("visibility") ?? "public";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const conditions = and(
    eq(content.visibility, visibility as "public"),
    content.publishedAt != null,
    categoryId ? eq(content.categoryId, categoryId) : undefined,
  );

  const posts = await db
    .select()
    .from(content)
    .where(conditions)
    .orderBy(desc(content.publishedAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return NextResponse.json({ data: posts });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const post = await db.insert(content).values(parsed.data).returning();
    return NextResponse.json(post[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}