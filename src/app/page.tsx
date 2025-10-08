import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Card } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo et titre principal */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-3xl">TL</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Tier of <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Legends</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8">
                La plateforme ultime pour classer vos skins League of Legends favoris
              </p>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                <div className="text-gray-600">Champions disponibles</div>
              </Card>
              <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                <div className="text-gray-600">Skins à classer</div>
              </Card>
              <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
                <div className="text-gray-600">Possibilités de classement</div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Section Concept */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Créez vos tier lists personnalisées en quelques clics et partagez vos opinions avec la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choisissez vos champions</h3>
              <p className="text-gray-600">
                Sélectionnez les champions dont vous voulez classer les skins parmi plus de 150 champions disponibles.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Classez par tiers</h3>
              <p className="text-gray-600">
                Organisez les skins dans différents tiers (S, A, B, C, D) selon vos préférences et votre style de jeu.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Partagez vos créations</h3>
              <p className="text-gray-600">
                Exportez vos tier lists et partagez-les avec vos amis ou sur les réseaux sociaux pour débattre !
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Fonctionnalités avancées
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Interface intuitive</h3>
                    <p className="text-gray-600">Drag & drop simple pour organiser vos skins facilement</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sauvegarde automatique</h3>
                    <p className="text-gray-600">Vos créations sont automatiquement sauvegardées</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Export haute qualité</h3>
                    <p className="text-gray-600">Exportez vos tier lists en haute résolution</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Base de données complète</h3>
                    <p className="text-gray-600">Tous les skins de League of Legends régulièrement mis à jour</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🚧 En développement</h3>
                  <p className="text-gray-600 mb-6">
                    Notre plateforme est actuellement en cours de développement. 
                    Bientôt, vous pourrez créer et partager vos tier lists !
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      🎉 Lancement prévu bientôt
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
