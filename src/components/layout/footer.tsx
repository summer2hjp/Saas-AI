"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">{t("common.app_name")}</h3>
            <p className="text-sm text-muted-foreground">
              Multi-tenant SaaS management platform
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t("nav.pricing")}</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/pricing`}>Plans</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t("nav.blog")}</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/blog`}>Articles</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t("common.app_name")}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}