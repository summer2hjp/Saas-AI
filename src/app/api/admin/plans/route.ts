import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const allPlans = await db
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(plans.sortOrder);

  return NextResponse.json({ data: allPlans });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const plan = await db.insert(plans).values(body).returning();
  return NextResponse.json(plan[0], { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  const [updated] = await db
    .update(plans)
    .set(updates)
    .where(eq(plans.id, id))
    .returning();
  return NextResponse.json(updated);
}