"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockPlans = [
  { name: "Starter", price: "$9.99/mo", active: true },
  { name: "Professional", price: "$29.99/mo", active: true },
  { name: "Enterprise", price: "$99.99/mo", active: true },
];

export default function AdminPlansPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t("admin.plans")}</h1>
        <div className="mb-4">
          <Button>{t("common.create")}</Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPlans.map((plan) => (
                  <tr key={plan.name} className="border-b">
                    <td className="p-4">{plan.name}</td>
                    <td className="p-4">{plan.price}</td>
                    <td className="p-4">
                      {plan.active ? "Active" : "Inactive"}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}