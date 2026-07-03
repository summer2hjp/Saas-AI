import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content, contentCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");
  if (!tenantId) {
    return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  }

  const posts = await db
    .select()
    .from(content)
    .where(eq(content.tenantId, tenantId))
    .orderBy(content.createdAt);

  return NextResponse.json({ data: posts });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const post = await db.insert(content).values(body).returning();
  return NextResponse.json(post[0], { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  const [updated] = await db
    .update(content)
    .set(updates)
    .where(eq(content.id, id))
    .returning();
  return NextResponse.json(updated);
}