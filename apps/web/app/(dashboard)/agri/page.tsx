import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AgriTech — Produits Agricoles RDC',
  description: 'Connectez producteurs et acheteurs de produits agricoles en RDC.',
}

const SAMPLE_PRODUCTS = [
  { id: '1', produit: 'Maïs', emoji: '🌽', quantite: 50, unite: 'sac (50kg)', prixUnitaire: 25, devise: 'USD', ville: 'Bukavu', province: 'Sud-Kivu', bio: true, certifie: false, disponible: true },
  { id: '2', produit: 'Manioc', emoji: '🟤', quantite: 200, unite: 'kg', prixUnitaire: 0.5, devise: 'USD', ville: 'Kinshasa', province: 'Kinshasa', bio: false, certifie: false, disponible: true },
  { id: '3', produit: 'Café Arabica', emoji: '☕', quantite: 500, unite: 'kg', prixUnitaire: 4.5, devise: 'USD', ville: 'Butembo', province: 'Nord-Kivu', bio: true, certifie: true, disponible: true },
  { id: '4', produit: 'Huile de palme', emoji: '🫙', quantite: 100, unite: 'litre', prixUnitaire: 1.8, devise: 'USD', ville: 'Mbandaka', province: 'Équateur', bio: false, certifie: false, disponible: true },
  { id: '5', produit: 'Tomates', emoji: '🍅', quantite: 500, unite: 'kg', prixUnitaire: 0.8, devise: 'USD', ville: 'Goma', province: 'Nord-Kivu', bio: true, certifie: false, disponible: true },
  { id: '6', produit: 'Bananes plantains', emoji: '🍌', quantite: 300, unite: 'régime', prixUnitaire: 3, devise: 'USD', ville: 'Kisangani', province: 'Tshopo', bio: false, certifie: false, disponible: true },
]

export default function AgriPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          🌾 AgriTech
        </h1>
        <p className="text-muted-foreground">Produits agricoles frais de toutes les provinces</p>
      </div>

      {/* Stats Banner */}
      <div
        className="rounded-[16px] p-4 mb-6 flex flex-wrap gap-4"
        style={{ background: 'linear-gradient(135deg, #00C85320, #00C85305)', border: '1px solid #00C85330' }}
      >
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#00C853' }}>2.4M ha</div>
          <div className="text-xs text-muted-foreground">Terres arables</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#00C853' }}>15K+</div>
          <div className="text-xs text-muted-foreground">Agriculteurs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#00C853' }}>48</div>
          <div className="text-xs text-muted-foreground">Produits référencés</div>
        </div>
      </div>

      {/* Search */}
      <div className="card-base p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍 Maïs, manioc, café, tomates..."
            className="input-field flex-1"
            readOnly
          />
          <select className="input-field sm:w-44">
            <option>Toutes provinces</option>
            <option>Kinshasa</option>
            <option>Nord-Kivu</option>
            <option>Sud-Kivu</option>
            <option>Équateur</option>
          </select>
          <button
            className="btn-primary whitespace-nowrap"
            style={{ backgroundColor: '#00C853', color: '#08080C' }}
          >
            Rechercher
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all border-[#00C853] bg-[#00C85320] text-[#00C853]"
          >
            🌿 Bio
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-muted-foreground">
            ✓ Certifié
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-muted-foreground">
            ✅ Disponible
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_PRODUCTS.map((product) => (
          <div key={product.id} className="card-base card-hover cursor-pointer">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-[10px] flex items-center justify-center text-3xl flex-shrink-0"
                style={{ backgroundColor: '#00C85320' }}
              >
                {product.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground">{product.produit}</h3>
                  {product.bio && (
                    <span className="badge bg-green-500/20 text-green-400 text-[10px]">🌿 Bio</span>
                  )}
                  {product.certifie && (
                    <span className="badge bg-blue-500/20 text-blue-400 text-[10px]">✓ Certifié</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  📍 {product.ville}, {product.province}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold" style={{ color: '#00C853' }}>
                      {product.prixUnitaire} {product.devise}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">/ {product.unite}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Qté: {product.quantite}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="flex-1 py-2 rounded-[10px] text-xs font-semibold border transition-all"
                style={{ borderColor: '#00C853', color: '#00C853' }}
              >
                Contacter
              </button>
              <button
                className="flex-1 py-2 rounded-[10px] text-xs font-semibold"
                style={{ backgroundColor: '#00C853', color: '#08080C' }}
              >
                Commander
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="btn-outline" style={{ borderColor: '#00C853', color: '#00C853' }}>
          Voir plus de produits
        </button>
      </div>

      <button
        className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg z-30 font-bold"
        style={{ backgroundColor: '#00C853', color: '#08080C' }}
        title="Publier un produit"
      >
        +
      </button>
    </div>
  )
}
