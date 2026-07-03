"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";

export default function ProfilePage() {
  const t = useTranslations();
  const [session, setSession] = useState<{
    user: { email: string; name?: string; image?: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((res) => {
      if (res.data) setSession(res.data as typeof session);
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

  const user = session?.user;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">{t("user.profile")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("user.profile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="mt-1">{user?.email ?? "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("auth.name")}
              </label>
              <p className="mt-1">{user?.name ?? "—"}</p>
            </div>
            <Button>{t("common.edit")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}