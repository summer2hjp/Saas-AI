import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/r2";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { requireSession } from "@/lib/auth/admin-guard";

export async function POST(req: NextRequest) {
  try {
    // Require authentication — extract user from session, not form data
    const { user } = await requireSession();
    const { tenantId, id: userId } = user;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "file required" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${tenantId}/${uuidv4()}-${file.name}`;

    await uploadFile(key, buffer, file.type);

    const [record] = await db
      .insert(files)
      .values({
        tenantId,
        userId,
        name: file.name,
        key,
        size: buffer.length,
        mimeType: file.type,
      })
      .returning();

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    // Auth errors return 401/403, not 500
    if (message.includes("Unauthorized") || message.includes("Forbidden")) {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}