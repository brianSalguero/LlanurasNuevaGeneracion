export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-20 md:pt-10 min-h-screen flex bg-white dark:bg-slate-950">
      {children}
    </main>
  );
}