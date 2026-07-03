import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export async function createCheckoutSession(
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function getCustomerId(email: string) {
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length > 0) return customers.data[0].id;
  const customer = await stripe.customers.create({ email });
  return customer.id;
}