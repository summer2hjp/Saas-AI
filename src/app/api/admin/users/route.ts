import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { z } from "zod";

const patchSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["super_admin", "admin", "member", "viewer"]),
});

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") ?? user.tenantId;

    const userList = await db
      .select()
      .from(users)
      .where(eq(users.tenantId, tenantId));

    return NextResponse.json({ data: userList });
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

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id, role } = parsed.data;

    const [updated] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}