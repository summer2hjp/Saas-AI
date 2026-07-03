"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface SubscriptionData {
  data: {
    id: string;
    status: string;
    planName: string;
    interval: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export default function SubscriptionPage() {
  const t = useTranslations();
  const [subData, setSubData] = useState<SubscriptionData["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((res) => res.json())
      .then((data: SubscriptionData) => setSubData(data.data))
      .catch(() => toast.error("Failed to load subscription"))
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-3xl font-bold mb-8">{t("user.subscription")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("pricing.current_plan")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subData ? (
              <>
                <div>
                  <span className="text-2xl font-bold">
                    {subData.planName}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    / {subData.interval}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Status: {subData.status}
                </p>
                {subData.cancelAtPeriodEnd && (
                  <p className="text-sm text-amber-600">
                    Cancels at period end
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No active subscription</p>
            )}
            <Button variant="outline">Manage Subscription</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}