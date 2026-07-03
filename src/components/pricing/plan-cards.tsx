"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/ui/cn";

export interface PlanCardData {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  isPopular?: boolean;
}

interface PlanCardsProps {
  plans: PlanCardData[];
  onSubscribe?: (planId: string) => void;
}

export function PlanCards({ plans, onSubscribe }: PlanCardsProps) {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "flex flex-col",
            plan.isPopular && "border-primary shadow-lg scale-105",
          )}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">
                ${(plan.price / 100).toFixed(2)}
              </span>
              <span className="text-muted-foreground ml-2">
                /{plan.interval}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="w-full"
              onClick={() => onSubscribe?.(plan.id)}
            >
              {t("pricing.subscribe")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}