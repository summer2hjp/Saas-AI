"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const t = useTranslations();

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
              <p className="mt-1">user@example.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("auth.name")}
              </label>
              <p className="mt-1">User</p>
            </div>
            <Button>{t("common.edit")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}