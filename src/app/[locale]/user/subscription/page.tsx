"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">{t("user.subscription")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("pricing.current_plan")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-2xl font-bold">Professional</span>
              <span className="text-muted-foreground ml-2">/ month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Status: Active
            </p>
            <Button variant="outline">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}