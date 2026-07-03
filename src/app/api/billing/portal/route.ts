import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerId, returnUrl } = body;

  if (!customerId) {
    return NextResponse.json(
      { error: "customerId required" },
      { status: 400 },
    );
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl ?? `${req.headers.get("origin")}/user/subscription`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}