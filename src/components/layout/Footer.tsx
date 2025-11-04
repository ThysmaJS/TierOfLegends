import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo et description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TL</span>
              </div>
              <span className="text-xl font-bold">Tier of Legends</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Créez et partagez vos tier lists des skins League of Legends avec la communauté.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/tier-lists" className="text-gray-400 hover:text-white transition-colors">
                  Tier Lists
                </Link>
              </li>
              <li>
                <Link href="/profil" className="text-gray-400 hover:text-white transition-colors">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://developer.riotgames.com/docs/lol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  API Riot Games
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <hr className="my-6 border-gray-700" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between text-sm text-gray-400 sm:flex-row">
          <p>© 2025 Tier of Legends. Projet éducatif.</p>
          <p className="mt-2 sm:mt-0">
            Non affilié à Riot Games. League of Legends est une marque de Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
