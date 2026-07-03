import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { eq, like, desc, and } from "drizzle-orm";

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
  const body = await req.json();
  const post = await db.insert(content).values(body).returning();
  return NextResponse.json(post[0], { status: 201 });
}