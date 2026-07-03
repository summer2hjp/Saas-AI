import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { subscriptions, plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await db
      .select({
        id: subscriptions.id,
        status: subscriptions.status,
        planName: plans.name,
        interval: plans.interval,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .leftJoin(plans, eq(subscriptions.planId, plans.id))
      .limit(1);

    if (sub.length === 0) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: sub[0] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}