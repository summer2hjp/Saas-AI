import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

async function getBlogPosts(locale: string) {
  try {
    const posts = await db
      .select({
        id: content.id,
        title: content.title,
        excerpt: content.excerpt,
        publishedAt: content.publishedAt,
      })
      .from(content)
      .where(
        and(
          eq(content.visibility, "public"),
          eq(content.categoryId, null), // blog posts are content without a category
        ),
      )
      .orderBy(desc(content.publishedAt))
      .limit(20);

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt ?? "",
      date: post.publishedAt
        ? new Date(post.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      hasContent: true,
    }));
  } catch {
    // Fallback content if DB is not available
    return [
      {
        id: "default-1",
        title: locale === "zh" ? "欢迎使用SaaS平台" : "Welcome to SaaS Platform",
        excerpt:
          locale === "zh"
            ? "探索我们多租户SaaS平台的核心功能"
            : "Explore the core features of our multi-tenant SaaS platform",
        date: "2026-07-01",
        hasContent: false,
      },
      {
        id: "default-2",
        title:
          locale === "zh" ? "安全最佳实践" : "Security Best Practices",
        excerpt:
          locale === "zh"
            ? "了解如何保护您的多租户应用"
            : "Learn how to secure your multi-tenant application",
        date: "2026-06-28",
        hasContent: false,
      },
    ];
  }
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();
  const posts = await getBlogPosts(locale);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{t("nav.blog")}</h1>
        <div className="grid gap-6 max-w-4xl">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}