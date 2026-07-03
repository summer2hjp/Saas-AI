import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailSubscriptions } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, tenantId } = body;

  if (!email || !tenantId) {
    return NextResponse.json(
      { error: "email and tenantId required" },
      { status: 400 },
    );
  }

  const [sub] = await db
    .insert(emailSubscriptions)
    .values({ email, tenantId })
    .onConflictDoNothing()
    .returning();

  return NextResponse.json(sub, { status: 201 });
}