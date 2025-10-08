export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">TL</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tier of Legends</h1>
          <p className="text-xl text-gray-600">Skins Tier Lists</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 border border-yellow-200 bg-yellow-50">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚧 Site en développement</h2>
          <p className="text-gray-700 mb-4">
            Notre plateforme de tier lists pour les skins League of Legends est actuellement en cours de développement.
          </p>
          <p className="text-sm text-gray-500">
            Bientôt, vous pourrez créer et partager vos classements de skins favoris !
          </p>
        </div>
      </div>
    </div>
  );
}
