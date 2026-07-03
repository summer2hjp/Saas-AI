import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");
  if (!tenantId) {
    return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  }

  const userList = await db
    .select()
    .from(users)
    .where(eq(users.tenantId, tenantId));

  return NextResponse.json({ data: userList });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, role } = body;

  if (!id || !role) {
    return NextResponse.json(
      { error: "id and role required" },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, id))
    .returning();

  return NextResponse.json(updated);
}