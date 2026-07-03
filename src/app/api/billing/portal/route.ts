import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireSession } from "@/lib/auth/admin-guard";
import { z } from "zod";

const portalSchema = z.object({
  customerId: z.string().min(1),
  returnUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireSession();
    const body = await req.json();

    const parsed = portalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { customerId, returnUrl } = parsed.data;

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url:
          returnUrl ?? `${req.headers.get("origin")}/user/subscription`,
      });

      return NextResponse.json({ url: session.url });
    } catch {
      return NextResponse.json(
        { error: "Failed to create portal session" },
        { status: 500 },
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}