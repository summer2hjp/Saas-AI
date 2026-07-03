"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import toast from "react-hot-toast";

export default function BillingPage() {
  const t = useTranslations();
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then(async (res) => {
      const user = res.data?.user as
        | { stripeCustomerId?: string }
        | undefined;
      if (user?.stripeCustomerId) {
        setStripeCustomerId(user.stripeCustomerId);
      }
      setLoading(false);
    });
  }, []);

  const handleBillingPortal = async () => {
    if (!stripeCustomerId) {
      toast.error("No billing account found");
      return;
    }
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: stripeCustomerId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to open billing portal");
      }
    } catch {
      toast.error("Failed to open billing portal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">{t("user.billing")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("user.billing")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {stripeCustomerId
                ? "Manage your billing information and payment methods."
                : "No billing information available yet."}
            </p>
            {stripeCustomerId && (
              <Button onClick={handleBillingPortal}>
                Open Billing Portal
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}