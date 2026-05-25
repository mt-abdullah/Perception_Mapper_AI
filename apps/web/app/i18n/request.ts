import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "ta", "si"] as const;

const messageImports = {
  en: () => import("../../messages/en.json"),
  ta: () => import("../../messages/ta.json"),
  si: () => import("../../messages/si.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) notFound();

  const importFn = messageImports[locale as keyof typeof messageImports];
  if (!importFn) notFound();

  return {
    locale,
    messages: (await importFn()).default,
  };
});
