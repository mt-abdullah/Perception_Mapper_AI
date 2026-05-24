import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "ta", "si"];

// Explicit dynamic imports map to guide Webpack compilation and avoid runtime resolving failures
const messageImports: Record<string, () => Promise<any>> = {
  en: () => import("../messages/en.json"),
  ta: () => import("../messages/ta.json"),
  si: () => import("../messages/si.json"),
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  
  const importFn = messageImports[locale];
  if (!importFn) notFound();

  return {
    messages: (await importFn()).default,
  };
});
