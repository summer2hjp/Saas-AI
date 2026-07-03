"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BillingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">{t("user.billing")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("user.billing")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("common.no_results")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}