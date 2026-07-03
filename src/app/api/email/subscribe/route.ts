import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailSubscriptions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  tenantId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, tenantId } = parsed.data;

  // Check for existing subscription (email + tenantId unique constraint)
  const existing = await db
    .select()
    .from(emailSubscriptions)
    .where(
      and(
        eq(emailSubscriptions.email, email),
        eq(emailSubscriptions.tenantId, tenantId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Already subscribed with this email for this tenant" },
      { status: 409 },
    );
  }

  const [sub] = await db
    .insert(emailSubscriptions)
    .values({ email, tenantId })
    .returning();

  return NextResponse.json(sub, { status: 201 });
}