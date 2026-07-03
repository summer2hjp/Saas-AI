import { NextRequest, NextResponse } from "next/server";
import { stripe, getCustomerId } from "@/lib/stripe";
import { requireSession } from "@/lib/auth/admin-guard";
import { z } from "zod";

const checkoutSchema = z.object({
  priceId: z.string().min(1),
  email: z.string().email(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireSession();
    const body = await req.json();

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { priceId, email, successUrl, cancelUrl } = parsed.data;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}