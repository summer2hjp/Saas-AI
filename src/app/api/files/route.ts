import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") ?? user.tenantId;

    const fileList = await db
      .select()
      .from(files)
      .where(eq(files.tenantId, tenantId))
      .orderBy(files.createdAt);

    return NextResponse.json({ data: fileList });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}