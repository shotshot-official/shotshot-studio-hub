import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-canvas)] text-neutral-100 flex flex-col items-center justify-center p-6">
      <div className="swiss-border p-12 text-center max-w-md w-full">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">404 // ERROR</div>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-3">Page Not Found</h1>
        <p className="text-xs font-mono text-neutral-400 mb-6">
          The requested resource does not exist in the studio archive.
        </p>
        <Link
          href="/"
          className="swiss-focus inline-flex items-center justify-center px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-bold hover:bg-neutral-200 transition-colors"
        >
          Return to Studio
        </Link>
      </div>
    </main>
  );
}
