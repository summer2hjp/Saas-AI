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
      if (!email) {
        console.warn("checkout.session.completed — no customer email");
        break;
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (!user) {
        console.warn(
          `checkout.session.completed — no user found for email: ${email}`,
        );
        break;
      }

      const [plan] = await db
        .select()
        .from(plans)
        .where(eq(plans.stripePriceId, session.metadata?.priceId ?? ""))
        .limit(1);
      if (!plan) {
        console.warn(
          `checkout.session.completed — no plan found for priceId: ${session.metadata?.priceId}`,
        );
        break;
      }

      // Handle subscription ID which may be a string or an object
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!subscriptionId) {
        console.warn(
          "checkout.session.completed — no subscription ID on session",
        );
        break;
      }

      await db.insert(subscriptions).values({
        tenantId: user.tenantId,
        userId: user.id,
        planId: plan.id,
        stripeSubscriptionId: subscriptionId,
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
      const updatedRows = await db
        .update(subscriptions)
        .set({
          status: sub.status as "active" | "canceled" | "past_due",
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));

      if (updatedRows.length === 0) {
        console.warn(
          `customer.subscription.${event.type === "customer.subscription.updated" ? "updated" : "deleted"} — no local subscription for stripeSubId: ${sub.id}`,
        );
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.warn("Payment failed for invoice:", invoice.id, invoice.customer);
      break;
    }
    default: {
      // Log unhandled event types for observability
      console.warn(`Unhandled Stripe webhook event type: ${event.type}`);
    }
  }

  return NextResponse.json({ received: true });
}