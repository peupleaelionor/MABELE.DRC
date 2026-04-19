// ─── Services Hub — Dark Premium ──────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Services — MABELE' }

const ACC = '#E05C1A'

const SERVICES = [
  { href:'/immo',       icon:'🏠', label:'Immobilier', desc:'Acheter, louer, vendre des biens immobiliers en RDC',         color:'#E05C1A', stats:'12 000+ annonces'       },
  { href:'/emploi',     icon:'💼', label:'Emploi',     desc:'Trouvez votre prochain poste ou recrutez des talents',         color:'#0891B2', stats:'3 500+ offres'          },
  { href:'/market',     icon:'🛒', label:'Marché',     desc:'Achetez et vendez tout type de produits en RDC',               color:'#E02020', stats:'45 000+ articles'       },
  { href:'/finance',    icon:'💰', label:'KangaPay',   desc:'Wallet, transferts d\'argent et paiements en ligne',           color:ACC,       stats:'1,25M CDF disponibles'  },
  { href:'/agri',       icon:'🌾', label:'AgriTech',   desc:'Connectez producteurs et acheteurs de produits agricoles',     color:'#16A34A', stats:'15 000+ agriculteurs'   },
  { href:'/logistique', icon:'🚛', label:'Logistique', desc:'Transport, livraison et déménagement partout en RDC',          color:'#0891B2', stats:'500+ prestataires'      },
  { href:'/outils',     icon:'🧾', label:'NKISI',      desc:'Facturation, devis et gestion business simplifiée',            color:'#7C3AED', stats:'Factures & Devis'       },
  { href:'/data',       icon:'📊', label:'Congo Data', desc:'Données économiques et indicateurs en temps réel',             color:'#1B4FB3', stats:'26 provinces'           },
  { href:'/bima',       icon:'🏥', label:'Bima Santé', desc:'Assurance santé 100% digitale — souscription en 2 min',        color:'#0891B2', stats:'250+ centres partenaires'},
]

export default function ServicesPage() {
  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">

      <div className="mb-8">
        <h1 className="font-bold text-2xl text-white">Tous les Services</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
          9 modules pour tout ce dont vous avez besoin en RDC
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((s) => (
          <Link key={s.href} href={s.href}
            className="rounded-2xl p-5 flex flex-col transition-all hover:-translate-y-0.5 group"
            style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>

            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
                 style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}>
              {s.icon}
            </div>

            <h2 className="font-bold text-base text-white mb-1">{s.label}</h2>
            <p className="text-xs leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.40)' }}>{s.desc}</p>

            <div className="flex items-center justify-between mt-4 pt-3"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                {s.stats}
              </span>
              <span className="text-sm font-bold transition-transform group-hover:translate-x-1"
                    style={{ color: s.color }}>
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl p-6 text-center"
           style={{ background: 'linear-gradient(135deg, #2A1A0A, #1A0D04)', border: `1px solid rgba(224,92,26,0.25)`, boxShadow: '0 4px 20px rgba(0,0,0,0.30)' }}>
        <h2 className="font-bold text-lg text-white mb-2">
          🇨🇩 La super-plateforme du Congo
        </h2>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.50)' }}>
          112M de Congolais · 26 provinces · 100% Mobile
        </p>
        <Link href="/publish"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
          + Publier une annonce
        </Link>
      </div>
    </div>
  )
}
