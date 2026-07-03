"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  isActive: boolean;
  features: string[];
  description: string | null;
}

export default function AdminPlansPage() {
  const t = useTranslations();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data.data ?? []))
      .catch(() => toast.error("Failed to load plans"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t("admin.plans")}</h1>
        <div className="mb-4">
          <Button>{t("common.create")}</Button>
        </div>
        <Card>
          <CardContent className="p-0">
            {plans.length === 0 ? (
              <p className="text-muted-foreground p-4">{t("common.no_results")}</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Interval</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b">
                      <td className="p-4">{plan.name}</td>
                      <td className="p-4">${(plan.price / 100).toFixed(2)}</td>
                      <td className="p-4">{plan.interval}</td>
                      <td className="p-4">
                        {plan.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">
                          {t("common.edit")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}