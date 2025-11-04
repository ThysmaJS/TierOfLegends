export const metadata = {
  title: "À propos — Tier of Legends",
  description: "Découvrez le projet, les sources de données et les objectifs de Tier of Legends.",
  alternates: { canonical: "/a-propos" },
  openGraph: {
    type: "article",
    url: "/a-propos",
    title: "À propos — Tier of Legends",
    description: "Découvrez le projet, les sources de données et les objectifs de Tier of Legends.",
    images: [{ url: "/window.svg", width: 1200, height: 630, alt: "Tier of Legends" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos — Tier of Legends",
    description: "Découvrez le projet, les sources de données et les objectifs de Tier of Legends.",
    images: ["/window.svg"],
  },
} as const;

import { getDictionary } from '@/i18n/getDictionary';

export default async function AProposPage() {
  const dict = await getDictionary('fr');
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">{dict.about.title}</h1>
        <div className="prose prose-invert max-w-none">
          <p>{dict.about.intro}</p>
          <h2>{dict.about.sourcesTitle}</h2>
          <p>
            {dict.about.sourcesText} 
            <a href="https://ddragon.leagueoflegends.com/" target="_blank" rel="noreferrer">(Riot Data Dragon)</a>.
          </p>
          <h2>{dict.about.featuresTitle}</h2>
          <ul>
            {dict.about.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
