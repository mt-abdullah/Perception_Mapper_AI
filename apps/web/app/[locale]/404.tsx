import { redirect } from "next/navigation";

export default function NotFoundPage({ params }: { params: { locale?: string } }) {
  const locale = params?.locale || "en";
  redirect(`/${locale}/sign-in`);
  return null;
}
