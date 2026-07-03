"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ContentPost {
  id: string;
  title: string;
  slug: string;
  visibility: string;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminCMSPage() {
  const t = useTranslations();
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data) => setPosts(data.data ?? []))
      .catch(() => toast.error("Failed to load content"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t("admin.cms")}</h1>
        <div className="mb-4">
          <Button>{t("common.create")}</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Content List</CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-muted-foreground">{t("common.no_results")}</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Slug</th>
                    <th className="pb-3 font-medium">Visibility</th>
                    <th className="pb-3 font-medium">Published</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b">
                      <td className="py-3">{post.title}</td>
                      <td className="py-3">{post.slug}</td>
                      <td className="py-3">{post.visibility}</td>
                      <td className="py-3">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">
                          {t("common.edit")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}