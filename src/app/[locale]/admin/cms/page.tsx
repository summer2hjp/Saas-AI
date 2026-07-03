"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminCMSPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t("admin.cms")}</h1>
        <div className="mb-4">
          <Button>{t("common.create")}</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Content List</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("common.no_results")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}