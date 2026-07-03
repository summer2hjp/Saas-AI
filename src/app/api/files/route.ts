import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");
  if (!tenantId) {
    return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  }

  const fileList = await db
    .select()
    .from(files)
    .where(eq(files.tenantId, tenantId))
    .orderBy(files.createdAt);

  return NextResponse.json({ data: fileList });
}