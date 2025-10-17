"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body className="min-h-screen grid place-items-center bg-gray-900 text-white p-8">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
          <p className="text-gray-300 break-words">{error.message}</p>
          <button onClick={reset} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20">Réessayer</button>
        </div>
      </body>
    </html>
  );
}
