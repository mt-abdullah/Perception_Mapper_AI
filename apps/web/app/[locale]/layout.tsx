import "../../src/styles/globals.css";
import { getMessages } from "next-intl/server";
import dynamic from "next/dynamic";

const Providers = dynamic(() => import("../../components/Providers"), {
  ssr: false,
});

export const metadata = {
  title: "Perception Mapper AI",
  description: "Multilingual sentiment, tone, and cognitive bias analyzer for English, Tamil, and Sinhala.",
};

interface LayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const messages = await getMessages({ locale });

  return (
    <Providers messages={messages} locale={locale}>
      {children}
    </Providers>
  );
}
