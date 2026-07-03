"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/ui/cn";

const plans = [
  {
    name: "Starter",
    price: 9.99,
    interval: "month",
    features: ["1 Project", "5 Team Members", "Basic Analytics", "Email Support"],
  },
  {
    name: "Professional",
    price: 29.99,
    interval: "month",
    features: [
      "Unlimited Projects",
      "Unlimited Team Members",
      "Advanced Analytics",
      "Priority Support",
      "Custom Domain",
    ],
  },
  {
    name: "Enterprise",
    price: 99.99,
    interval: "month",
    features: [
      "Everything in Professional",
      "Dedicated Account Manager",
      "Custom Integrations",
      "SLA Guarantee",
      "On-premises Option",
    ],
  },
];

export default function PricingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("pricing.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("pricing.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Card
              key={plan.name}
              className={cn(
                "flex flex-col",
                i === 1 && "border-primary shadow-lg scale-105",
              )}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{plan.interval}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full">
                  {t("pricing.subscribe")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}