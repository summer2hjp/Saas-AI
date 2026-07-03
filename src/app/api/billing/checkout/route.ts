import { NextRequest, NextResponse } from "next/server";
import { stripe, getCustomerId } from "@/lib/stripe";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { priceId, email, successUrl, cancelUrl } = body;

  if (!priceId || !email) {
    return NextResponse.json(
      { error: "priceId and email required" },
      { status: 400 },
    );
  }

  try {
    const customerId = await getCustomerId(email);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      success_url: successUrl ?? `${req.headers.get("origin")}/dashboard`,
      cancel_url: cancelUrl ?? `${req.headers.get("origin")}/pricing`,
      metadata: { priceId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}