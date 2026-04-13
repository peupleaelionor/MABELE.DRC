import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Immobilier — Annonces RDC',
  description: 'Trouvez votre bien immobilier en République Démocratique du Congo.',
}

const TYPES = ['Tous', 'Appartement', 'Maison', 'Villa', 'Terrain', 'Bureau', 'Local']
const ACTIONS = ['Tous', 'Location', 'Vente']
const VILLES = ['Toutes', 'Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Mbuji-Mayi', 'Kisangani']

const SAMPLE_LISTINGS = [
  {
    id: '1',
    type: 'Villa',
    action: 'Vente',
    titre: 'Belle villa avec piscine à Gombe',
    ville: 'Kinshasa',
    quartier: 'Gombe',
    prix: 450000,
    devise: 'USD',
    surface: 400,
    chambres: 5,
    sallesBain: 3,
    parking: true,
    gardien: true,
    titreVerifie: true,
    photos: ['🏡'],
    vues: 234,
  },
  {
    id: '2',
    type: 'Appartement',
    action: 'Location',
    titre: 'Appartement meublé 3 chambres à Lingwala',
    ville: 'Kinshasa',
    quartier: 'Lingwala',
    prix: 1200,
    devise: 'USD',
    surface: 120,
    chambres: 3,
    sallesBain: 2,
    parking: false,
    gardien: true,
    titreVerifie: false,
    photos: ['🏠'],
    vues: 89,
  },
  {
    id: '3',
    type: 'Terrain',
    action: 'Vente',
    titre: 'Terrain 1000m² à Ngaliema avec titre',
    ville: 'Kinshasa',
    quartier: 'Ngaliema',
    prix: 85000,
    devise: 'USD',
    surface: 1000,
    chambres: 0,
    sallesBain: 0,
    parking: false,
    gardien: false,
    titreVerifie: true,
    photos: ['🌿'],
    vues: 156,
  },
  {
    id: '4',
    type: 'Bureau',
    action: 'Location',
    titre: 'Espace bureau moderne au centre-ville',
    ville: 'Lubumbashi',
    quartier: 'Centre',
    prix: 2500,
    devise: 'USD',
    surface: 200,
    chambres: 0,
    sallesBain: 2,
    parking: true,
    gardien: true,
    titreVerifie: true,
    photos: ['🏢'],
    vues: 67,
  },
  {
    id: '5',
    type: 'Maison',
    action: 'Vente',
    titre: 'Maison familiale 4 chambres à Goma',
    ville: 'Goma',
    quartier: 'Volcans',
    prix: 120000,
    devise: 'USD',
    surface: 180,
    chambres: 4,
    sallesBain: 2,
    parking: true,
    gardien: false,
    titreVerifie: false,
    photos: ['🏡'],
    vues: 43,
  },
  {
    id: '6',
    type: 'Appartement',
    action: 'Location',
    titre: 'Studio meublé proche université',
    ville: 'Kinshasa',
    quartier: 'Lemba',
    prix: 350,
    devise: 'USD',
    surface: 35,
    chambres: 1,
    sallesBain: 1,
    parking: false,
    gardien: false,
    titreVerifie: false,
    photos: ['🏠'],
    vues: 201,
  },
]

export default function ImmoPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          🏠 Immobilier
        </h1>
        <p className="text-muted-foreground">
          {SAMPLE_LISTINGS.length} annonces disponibles en RDC
        </p>
      </div>

      {/* Search Bar */}
      <div className="card-base p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍 Rechercher: villa, appartement, terrain..."
            className="input-field flex-1"
            readOnly
          />
          <button className="btn-primary whitespace-nowrap" style={{ backgroundColor: '#BB902A', color: '#0E0E0E' }}>
            Rechercher
          </button>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
        {TYPES.map((type) => (
          <button
            key={type}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
              type === 'Tous'
                ? 'border-[#BB902A] bg-[#BB902A20] text-[#BB902A]'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {ACTIONS.map((action) => (
          <button
            key={action}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              action === 'Tous'
                ? 'border-[#BB902A] bg-[#BB902A20] text-[#BB902A]'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            {action}
          </button>
        ))}
        <select className="bg-muted border border-border rounded-full px-3 py-1.5 text-xs text-muted-foreground">
          {VILLES.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="bg-muted border border-border rounded-full px-3 py-1.5 text-xs text-muted-foreground">
          <option>Budget max</option>
          <option>500 USD</option>
          <option>1 000 USD</option>
          <option>5 000 USD</option>
          <option>50 000 USD</option>
          <option>200 000 USD</option>
        </select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_LISTINGS.map((listing) => (
          <div key={listing.id} className="card-base card-hover cursor-pointer overflow-hidden">
            <div className="h-40 bg-muted rounded-[10px] mb-4 flex items-center justify-center text-5xl">
              {listing.photos[0]}
            </div>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="badge text-[10px]"
                style={{
                  backgroundColor: listing.action === 'Vente' ? '#BB902A20' : '#26C6DA20',
                  color: listing.action === 'Vente' ? '#BB902A' : '#26C6DA',
                }}
              >
                {listing.action}
              </span>
              <span className="badge bg-muted text-muted-foreground text-[10px]">{listing.type}</span>
              {listing.titreVerifie && (
                <span className="badge bg-green-500/20 text-green-400 text-[10px]">✓ Titre vérifié</span>
              )}
            </div>

            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{listing.titre}</h3>
            <p className="text-xs text-muted-foreground mb-3">📍 {listing.quartier}, {listing.ville}</p>

            {listing.surface > 0 && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span>📐 {listing.surface}m²</span>
                {listing.chambres > 0 && <span>🛏 {listing.chambres} ch.</span>}
                {listing.sallesBain > 0 && <span>🚿 {listing.sallesBain}</span>}
              </div>
            )}

            <div className="flex gap-2 flex-wrap mb-3">
              {listing.parking && <span className="text-xs text-muted-foreground">🚗 Parking</span>}
              {listing.gardien && <span className="text-xs text-muted-foreground">💂 Gardien</span>}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold" style={{ color: '#BB902A' }}>
                  {listing.prix.toLocaleString('fr-FR')}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {listing.devise}{listing.action === 'Location' ? '/mois' : ''}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">👁 {listing.vues}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="btn-outline">Charger plus d&apos;annonces</button>
      </div>

      <button
        className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg glow-gold z-30 font-bold"
        style={{ backgroundColor: '#BB902A', color: '#0E0E0E' }}
        title="Publier une annonce"
      >
        +
      </button>
    </div>
  )
}
