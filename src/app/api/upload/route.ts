import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/r2";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tenantId = formData.get("tenantId") as string;
    const userId = formData.get("userId") as string;

    if (!file || !tenantId || !userId) {
      return NextResponse.json(
        { error: "file, tenantId, and userId required" },
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
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}