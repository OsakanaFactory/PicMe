import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-slate-500">
        <p>
          Powered by <Link href="/" className="font-semibold text-slate-900 hover:underline">PicMe</Link>
        </p>
      </footer>
    </div>
  );
}
