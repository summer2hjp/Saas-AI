import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const t = await getTranslations();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const tenantId = user?.tenantId;

  // Fetch real data
  let subCount = 0;
  let memberCount = 0;

  if (tenantId) {
    try {
      const subs = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.tenantId, tenantId));
      subCount = subs.length;

      const members = await db
        .select()
        .from(users)
        .where(eq(users.tenantId, tenantId));
      memberCount = members.length;
    } catch {
      // DB query failed, use fallback
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{t("dashboard.title")}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {t("dashboard.welcome", { name: user?.name ?? "User" })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{subCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{memberCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">—</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recent_activity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}