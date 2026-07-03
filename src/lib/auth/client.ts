import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  turnstileClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    turnstileClient({
      siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
    }),
  ],
});
