import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center px-6 py-16 text-center">
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">Erreur 404</p>
        <h1 className="text-3xl font-semibold">Oups, page introuvable</h1>
        <p className="text-neutral-400 max-w-prose mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition px-4 py-2 text-sm"
        >
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
