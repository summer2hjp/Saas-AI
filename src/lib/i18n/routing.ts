export const routing = {
  locales: ["en", "zh"] as const,
  defaultLocale: "zh" as const,
};

export type Locale = (typeof routing.locales)[number];