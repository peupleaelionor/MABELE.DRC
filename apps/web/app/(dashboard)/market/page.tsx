import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marché — Marketplace RDC',
  description: 'Achetez et vendez tout ce que vous voulez en République Démocratique du Congo.',
}

const CATEGORIES = [
  { id: 'all', label: 'Tout', emoji: '🛒' },
  { id: 'elec', label: 'Électronique', emoji: '📱' },
  { id: 'vehicules', label: 'Véhicules', emoji: '🚗' },
  { id: 'vetements', label: 'Vêtements', emoji: '👗' },
  { id: 'maison', label: 'Maison', emoji: '🏠' },
  { id: 'agriculture', label: 'Agriculture', emoji: '🌾' },
  { id: 'beaute', label: 'Beauté', emoji: '💄' },
  { id: 'sport', label: 'Sport', emoji: '⚽' },
]

const SAMPLE_ITEMS = [
  {
    id: '1',
    nom: 'iPhone 13 Pro — 256GB',
    categorie: 'Électronique',
    prix: 750,
    devise: 'USD',
    etat: 'Occasion',
    ville: 'Kinshasa',
    photo: '📱',
    vues: 234,
  },
  {
    id: '2',
    nom: 'Toyota Corolla 2018',
    categorie: 'Véhicules',
    prix: 18500,
    devise: 'USD',
    etat: 'Occasion',
    ville: 'Kinshasa',
    photo: '🚗',
    vues: 456,
  },
  {
    id: '3',
    nom: 'Frigidaire Samsung 350L',
    categorie: 'Maison',
    prix: 580,
    devise: 'USD',
    etat: 'Neuf',
    ville: 'Lubumbashi',
    photo: '🧊',
    vues: 89,
  },
  {
    id: '4',
    nom: 'Groupe électrogène 5KVA',
    categorie: 'Maison',
    prix: 1200,
    devise: 'USD',
    etat: 'Occasion',
    ville: 'Kinshasa',
    photo: '⚡',
    vues: 321,
  },
  {
    id: '5',
    nom: 'Laptop Dell XPS 15 — i7',
    categorie: 'Électronique',
    prix: 1100,
    devise: 'USD',
    etat: 'Reconditionné',
    ville: 'Goma',
    photo: '💻',
    vues: 178,
  },
  {
    id: '6',
    nom: 'Moto Honda CBF 125',
    categorie: 'Véhicules',
    prix: 2200,
    devise: 'USD',
    etat: 'Occasion',
    ville: 'Mbuji-Mayi',
    photo: '🏍',
    vues: 267,
  },
  {
    id: '7',
    nom: 'Machine à coudre industrielle',
    categorie: 'Maison',
    prix: 450,
    devise: 'USD',
    etat: 'Occasion',
    ville: 'Kinshasa',
    photo: '🪡',
    vues: 43,
  },
  {
    id: '8',
    nom: 'Téléviseur LG OLED 55"',
    categorie: 'Électronique',
    prix: 890,
    devise: 'USD',
    etat: 'Neuf',
    ville: 'Kinshasa',
    photo: '📺',
    vues: 156,
  },
]

const etatColors: Record<string, string> = {
  Neuf: '#00C853',
  Occasion: '#FFB300',
  Reconditionné: '#26C6DA',
}

export default function MarketPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          🛒 Marché
        </h1>
        <p className="text-muted-foreground">{SAMPLE_ITEMS.length} articles disponibles</p>
      </div>

      {/* Search */}
      <div className="card-base p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍 Rechercher un article..."
            className="input-field flex-1"
            readOnly
          />
          <select className="input-field sm:w-40">
            <option>Toutes villes</option>
            <option>Kinshasa</option>
            <option>Lubumbashi</option>
            <option>Goma</option>
          </select>
          <button className="btn-primary whitespace-nowrap" style={{ backgroundColor: '#FF5252', color: '#fff' }}>
            Rechercher
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-[16px] border text-center min-w-[72px] transition-all ${
              cat.id === 'all'
                ? 'border-[#FF5252] bg-[#FF525220]'
                : 'border-border bg-card hover:border-muted-foreground'
            }`}
          >
            <span className="text-xl">{cat.emoji}</span>
            <span
              className="text-[10px] font-medium whitespace-nowrap"
              style={{ color: cat.id === 'all' ? '#FF5252' : '#9090A0' }}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {SAMPLE_ITEMS.map((item) => (
          <div key={item.id} className="card-base card-hover cursor-pointer overflow-hidden p-0">
            <div className="h-36 bg-muted flex items-center justify-center text-5xl rounded-t-[16px]">
              {item.photo}
            </div>
            <div className="p-3">
              <span
                className="badge text-[9px] mb-1"
                style={{
                  backgroundColor: `${etatColors[item.etat]}20`,
                  color: etatColors[item.etat],
                }}
              >
                {item.etat}
              </span>
              <h3 className="text-xs font-semibold text-foreground line-clamp-2 mt-1 mb-2">
                {item.nom}
              </h3>
              <div className="text-sm font-bold" style={{ color: '#FF5252' }}>
                {item.prix.toLocaleString('fr-FR')} {item.devise}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">📍 {item.ville}</span>
                <span className="text-[10px] text-muted-foreground">👁 {item.vues}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="btn-outline" style={{ borderColor: '#FF5252', color: '#FF5252' }}>
          Voir plus d&apos;articles
        </button>
      </div>

      <button
        className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg z-30 font-bold text-white"
        style={{ backgroundColor: '#FF5252' }}
        title="Vendre un article"
      >
        +
      </button>
    </div>
  )
}
