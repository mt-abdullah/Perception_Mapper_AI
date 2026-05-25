

export default function Error500Page({ error }: { error: Error }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <h1 className="text-2xl font-bold">Server error occurred</h1>
      </body>
    </html>
  );
}
