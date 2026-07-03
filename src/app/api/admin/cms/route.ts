import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500).optional(),
  slug: z.string().min(1).max(500).optional(),
  body: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  visibility: z
    .enum(["public", "logged_in", "subscriber", "paywalled"])
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") ?? user.tenantId;

    const posts = await db
      .select()
      .from(content)
      .where(eq(content.tenantId, tenantId))
      .orderBy(content.createdAt);

    return NextResponse.json({ data: posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
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

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id, ...updates } = parsed.data;
    const [updated] = await db
      .update(content)
      .set(updates)
      .where(eq(content.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}