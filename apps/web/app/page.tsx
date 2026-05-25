import { redirect } from "next/navigation";

// Root page: middleware handles locale routing (/ → /en).
// This is a safety fallback in case middleware is bypassed.
export default function RootPage() {
  redirect("/en");
}
