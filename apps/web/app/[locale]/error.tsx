"use client";






export default function ErrorPage({ error }: { error: Error }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
      </body>
    </html>
  );
}
