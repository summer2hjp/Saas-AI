import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { deleteFile } from "@/lib/r2";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id, key } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  if (key) {
    await deleteFile(key);
  }

  await db.delete(files).where(eq(files.id, id));
  return NextResponse.json({ deleted: true });
}