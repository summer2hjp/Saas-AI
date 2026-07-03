"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.register")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("auth.name")}</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("auth.email")}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("auth.password")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {/* Turnstile widget — better-auth plugin handles injection */}
            <div ref={turnstileRef} id="turnstile-widget" />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.loading") : t("auth.register")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}