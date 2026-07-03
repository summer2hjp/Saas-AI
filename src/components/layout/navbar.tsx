"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/ui/cn";

const navItems = [
  { href: "/pricing", label: "nav.pricing" },
  { href: "/blog", label: "nav.blog" },
  { href: "/dashboard", label: "nav.dashboard" },
];

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold text-primary"
          >
            {t("common.app_name")}
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-8">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(`/${locale}${item.href}`);
              return (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/auth/login`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            {t("nav.sign_in")}
          </Link>
          <Link
            href={`/${locale}/auth/register`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("nav.sign_up")}
          </Link>
        </div>
      </div>
    </header>
  );
}