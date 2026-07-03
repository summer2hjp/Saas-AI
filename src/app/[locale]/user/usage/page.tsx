"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth";

export default function UsagePage() {
  const t = useTranslations();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((res) => {
      const user = res.data?.user as { credits?: number } | undefined;
      if (user?.credits !== undefined) {
        setCredits(user.credits);
      }
      setLoading(false);
    });
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
        <h1 className="text-3xl font-bold mb-8">{t("user.usage")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("user.credits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{credits ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>API Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">—</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}