import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { sessions, users, tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { MagicLinkEmail } from "@/components/emails/magic-link";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  magicLink: {
    enabled: true,
    sendMagicLink: async ({ email, url }) => {
      if (!resend) return;
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "noreply@saas-app.com",
        to: email,
        subject: "Sign in to SaaS App",
        react: MagicLinkEmail({ url }),
      });
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      const [tenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, user.tenantId))
        .limit(1);
      return {
        ...session,
        user: {
          ...user,
          tenant: tenant ?? null,
        },
      };
    },
  },
});
