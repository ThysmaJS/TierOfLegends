"use client";

import { Avatar, Badge, Button, Card, Container, StatCard, TierListCard } from '../../components';

export default function ProfilPage() {
  const tierLists = [
    {
      title: "Tier List ADC - Saison 14",
      description: "Mon classement des meilleurs skins ADC",
      views: 247,
      likes: 15,
      gradientFrom: "from-blue-500",
      gradientTo: "to-purple-600",
      previewText: "ADC Skins S14"
    },
    {
      title: "Skins Légendaires 2024",
      description: "Classement des skins légendaires",
      views: 892,
      likes: 34,
      gradientFrom: "from-purple-500",
      gradientTo: "to-pink-600",
      previewText: "Legendary Skins"
    },
    {
      title: "Top Support Skins",
      description: "Mes skins support favoris",
      views: 456,
      likes: 22,
      gradientFrom: "from-green-500",
      gradientTo: "to-teal-600",
      previewText: "Support Skins"
    },
    {
      title: "Skins Jungle Meta",
      description: "Skins pour junglers efficaces",
      views: 321,
      likes: 18,
      gradientFrom: "from-red-500",
      gradientTo: "to-orange-600",
      previewText: "Jungle Picks"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        
        {/* Section Profil Principal */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar initials="JD" size="xl" editable />

            {/* Informations principales */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-600 mb-3">Passionné de League of Legends depuis 2015</p>
              
              {/* Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                <Badge variant="blue">Rang: Gold II</Badge>
                <Badge variant="purple">Champion favori: Jinx</Badge>
                <Badge variant="green">15 Tier Lists</Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Button>Modifier le profil</Button>
                <Button variant="secondary">Paramètres</Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section Informations */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">john.doe@email.com</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pseudo LoL</label>
                  <p className="text-gray-900">JohnTheADC</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                  <p className="text-gray-900">EUW (Europe West)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membre depuis</label>
                  <p className="text-gray-900">Octobre 2024</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle principal</label>
                  <p className="text-gray-900">ADC</p>
                </div>
              </div>
            </Card>

            {/* Statistiques détaillées */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques</h2>
              
              <div className="space-y-4">
                <StatCard label="Tier Lists créées" value={15} color="blue" />
                <StatCard label="Vues totales" value="2,847" color="green" />
                <StatCard label="Likes reçus" value={143} color="purple" />
                <StatCard label="Commentaires" value={67} color="orange" />
                <StatCard label="Abonnés" value={28} color="red" />
              </div>
            </Card>
          </div>

          {/* Section Mes Tier Lists */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes Tier Lists</h2>
                <Button>+ Nouvelle Tier List</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {tierLists.map((tierList, index) => (
                  <TierListCard
                    key={index}
                    title={tierList.title}
                    description={tierList.description}
                    views={tierList.views}
                    likes={tierList.likes}
                    gradientFrom={tierList.gradientFrom}
                    gradientTo={tierList.gradientTo}
                    previewText={tierList.previewText}
                    onView={() => console.log('Voir tier list:', tierList.title)}
                    onEdit={() => console.log('Modifier tier list:', tierList.title)}
                  />
                ))}
              </div>

              {/* Bouton Voir Plus */}
              <div className="text-center">
                <Button variant="secondary" size="lg">
                  Voir toutes mes tier lists
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </Container>
    </div>
  );
}
