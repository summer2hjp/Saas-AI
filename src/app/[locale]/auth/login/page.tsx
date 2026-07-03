"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Props {
  params: Promise<{ locale: string }>;
}

export default function LoginPage({ params }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        // Turnstile token is handled by the better-auth turnstile plugin
        // which automatically injects it if the widget is rendered
      });
      if (error) {
        toast.error(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await authClient.signIn.social({ provider });
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.signIn.magicLink({ email });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t("auth.magic_link_sent"));
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
          <CardTitle>{t("auth.login")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("auth.email")}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("auth.password")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Turnstile widget container — better-auth turnstile plugin injects here */}
            <div ref={turnstileRef} id="turnstile-widget" />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.loading") : t("auth.login")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
            >
              {t("auth.google")}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("github")}
            >
              {t("auth.github")}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={handleMagicLink}
            >
              {t("auth.magic_link")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}