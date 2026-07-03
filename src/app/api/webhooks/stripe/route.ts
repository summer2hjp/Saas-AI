import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { subscriptions, users, plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_details?.email;
      if (!email) break;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (!user) break;

      const [plan] = await db
        .select()
        .from(plans)
        .where(eq(plans.stripePriceId, session.metadata?.priceId ?? ""))
        .limit(1);
      if (!plan) break;

      await db.insert(subscriptions).values({
        tenantId: user.tenantId,
        userId: user.id,
        planId: plan.id,
        stripeSubscriptionId: session.subscription as string,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ),
      });
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await db
        .update(subscriptions)
        .set({
          status: sub.status as "active" | "canceled" | "past_due",
          updatedAt: new Date(),
        })
        .where(
          eq(subscriptions.stripeSubscriptionId, sub.id),
        );
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // Notify user about failed payment
      console.warn("Payment failed for invoice:", invoice.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}