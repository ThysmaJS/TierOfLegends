import { Container } from '@/components/layout';
import { Card } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo et titre principal */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-3xl">TL</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Tier of <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Legends</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8">
                La plateforme ultime pour classer vos skins League of Legends favoris
              </p>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-400 mb-2">150+</div>
                <div className="text-gray-300">Champions disponibles</div>
              </Card>
              <Card className="text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
                <div className="text-gray-300">Skins à classer</div>
              </Card>
              <Card className="text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
                <div className="text-gray-300">Possibilités de classement</div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Section Concept */}
      <section className="py-16 lg:py-24 bg-white/5 backdrop-blur-sm border-t border-b border-white/10">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Créez vos tier lists personnalisées en quelques clics et partagez vos opinions avec la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow bg-white/5 border border-white/10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Choisissez vos champions</h3>
              <p className="text-gray-300">
                Sélectionnez les champions dont vous voulez classer les skins parmi plus de 150 champions disponibles.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow bg-white/5 border border-white/10">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Classez par tiers</h3>
              <p className="text-gray-300">
                Organisez les skins dans différents tiers (S, A, B, C, D) selon vos préférences et votre style de jeu.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow bg-white/5 border border-white/10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Partagez vos créations</h3>
              <p className="text-gray-300">
                Exportez vos tier lists et partagez-les avec vos amis ou sur les réseaux sociaux pour débattre !
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-16 lg:py-24 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Fonctionnalités avancées
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Interface intuitive</h3>
                    <p className="text-gray-300">Drag & drop simple pour organiser vos skins facilement</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Sauvegarde automatique</h3>
                    <p className="text-gray-300">Vos créations sont automatiquement sauvegardées</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Export haute qualité</h3>
                    <p className="text-gray-300">Exportez vos tier lists en haute résolution</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Base de données complète</h3>
                    <p className="text-gray-300">Tous les skins de League of Legends régulièrement mis à jour</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 shadow-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">🚧 En développement</h3>
                  <p className="text-gray-300 mb-6">
                    Notre plateforme est actuellement en cours de développement. 
                    Bientôt, vous pourrez créer et partager vos tier lists !
                  </p>
                  <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300 font-medium">
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
