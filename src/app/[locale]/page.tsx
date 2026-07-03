import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              {t("common.app_name")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Multi-tenant SaaS platform with built-in auth, payments, CMS, and
              team management.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t("pricing.title")}
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-md border border-input px-8 py-3 text-lg font-medium hover:bg-accent"
              >
                {t("nav.sign_up")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}