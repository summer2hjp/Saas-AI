"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminFilesPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t("admin.files")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>File Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("common.no_results")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}