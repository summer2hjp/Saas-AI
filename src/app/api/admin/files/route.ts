import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { deleteFile } from "@/lib/r2";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string().uuid(),
  key: z.string().optional(),
});

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

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id, key } = parsed.data;

    if (key) {
      await deleteFile(key);
    }

    await db.delete(files).where(eq(files.id, id));
    return NextResponse.json({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}