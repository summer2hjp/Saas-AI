"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockUsers = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "member" },
];

export default function AdminUsersPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t("admin.users")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.users")}</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">{user.name}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">{user.role}</td>
                    <td className="py-3">
                      <Button variant="outline" size="sm">
                        {t("common.edit")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}