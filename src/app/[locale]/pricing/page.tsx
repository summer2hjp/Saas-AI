import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/ui/cn";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface Props {
  params: Promise<{ locale: string }>;
}

async function getActivePlans() {
  try {
    return await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true))
      .orderBy(plans.sortOrder);
  } catch {
    return [];
  }
}

function formatPrice(cents: number, interval: string) {
  const dollars = (cents / 100).toFixed(2);
  return { dollars, interval };
}

export default async function PricingPage({ params }: Props) {
  const t = await getTranslations();
  const activePlans = await getActivePlans();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("pricing.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("pricing.subtitle")}
          </p>
        </div>

        {activePlans.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {t("common.no_results")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {activePlans.map((plan, i) => {
              const { dollars, interval } = formatPrice(plan.price, plan.interval);
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "flex flex-col",
                    i === 1 && "border-primary shadow-lg scale-105",
                  )}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.description}
                      </p>
                    )}
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${dollars}</span>
                      <span className="text-muted-foreground ml-2">/{interval}</span>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}