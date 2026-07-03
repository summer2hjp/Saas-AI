"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/ui/cn";

const adminLinks = [
  { href: "/admin", label: "nav.home", icon: "📊" },
  { href: "/admin/users", label: "admin.users", icon: "👥" },
  { href: "/admin/plans", label: "admin.plans", icon: "📋" },
  { href: "/admin/cms", label: "admin.cms", icon: "📝" },
  { href: "/admin/files", label: "admin.files", icon: "📁" },
];

export function AdminSidebar({ locale }: { locale: string }) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/50 min-h-screen p-4">
      <nav className="space-y-1">
        {adminLinks.map((link) => {
          const href = `/${locale}${link.href}`;
          const isActive = pathname === href;
          return (
            <Link
              key={link.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <span>{link.icon}</span>
              {t(link.label)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}