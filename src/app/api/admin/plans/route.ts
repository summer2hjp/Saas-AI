import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().int().positive(),
  interval: z.enum(["month", "year"]),
  tenantId: z.string().uuid(),
  features: z.array(z.string()).default([]),
  stripePriceId: z.string().optional(),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  interval: z.enum(["month", "year"]).optional(),
  isActive: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  stripePriceId: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    await requireAdmin();

    const allPlans = await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true))
      .orderBy(plans.sortOrder);

    return NextResponse.json({ data: allPlans });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const plan = await db.insert(plans).values(parsed.data).returning();
    return NextResponse.json(plan[0], { status: 201 });
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

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id, ...updates } = parsed.data;
    const [updated] = await db
      .update(plans)
      .set(updates)
      .where(eq(plans.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}