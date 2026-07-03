"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

interface FileRecord {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function AdminFilesPage() {
  const t = useTranslations();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/files")
      .then((res) => res.json())
      .then((data) => setFiles(data.data ?? []))
      .catch(() => toast.error("Failed to load files"))
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
        <h1 className="text-3xl font-bold mb-8">{t("admin.files")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>File Manager</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-muted-foreground">{t("common.no_results")}</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id} className="border-b">
                      <td className="py-3">{file.name}</td>
                      <td className="py-3">{file.mimeType}</td>
                      <td className="py-3">
                        {(file.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="py-3">
                        {new Date(file.createdAt).toLocaleDateString()}
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