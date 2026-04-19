'use client'
// ─── Profile & Notifications — Dark Premium ────────────────────────────────────
import { useState } from 'react'
import Link from 'next/link'

const ACC = '#E05C1A'

const NOTIFS = [
  { icon: '✅', title: 'Annonce acceptée',             desc: 'Votre annonce "Appartement Gombe" a été validée.', time: 'il y a 5 min',  color: '#22C55E', unread: true  },
  { icon: '💬', title: 'Nouveau message de Nadine N.', desc: 'Merci, je confirme pour demain.',                  time: 'il y a 12 min', color: '#38BDF8', unread: true  },
  { icon: '💰', title: 'Paiement KangaPay reçu',       desc: '15 000 CDF reçu de Jean Mukoko.',                  time: 'il y a 1h',     color: ACC,       unread: false },
  { icon: '🔔', title: 'Alerte annonce',                desc: 'Nouveau bien dans votre zone de recherche.',       time: 'il y a 3h',     color: '#38BDF8', unread: false },
  { icon: '⭐', title: 'Score Trust amélioré',         desc: 'Votre score Trust est passé de 820 à 850.',         time: 'hier',          color: ACC,       unread: false },
  { icon: '📋', title: 'Facture NKISI envoyée',        desc: 'FAC-2025-002 envoyée à Jean Kabila Mutombo.',       time: 'hier',          color: '#7C3AED', unread: false },
]

const MY_LISTINGS = [
  { id:'1', title:'Appartement 3 ch. — Gombe', price:'5 000 USD/mois', status:'active',  views:156 },
  { id:'2', title:'Villa à Ngaliema',           price:'450 000 USD',    status:'pending', views:34  },
]

export default function ProfilePage() {
  const [tab, setTab] = useState<'notifs' | 'annonces' | 'settings'>('notifs')
  const unreadCount = NOTIFS.filter(n => n.unread).length

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">

      <div className="mb-6">
        <h1 className="font-bold text-2xl text-white">Mon Compte</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Gérez votre profil et vos notifications
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left: User Card */}
        <div className="flex-shrink-0 lg:w-72 space-y-4">

          <div className="rounded-2xl p-5"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-3 text-white"
                   style={{ backgroundColor: ACC }}>
                J
              </div>
              <h2 className="font-bold text-lg text-white">Jean-Pierre Mutombo</h2>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Particulier · Kinshasa
              </p>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full"
                   style={{ backgroundColor: 'rgba(224,92,26,0.12)', border: '1px solid rgba(224,92,26,0.20)' }}>
                <span className="text-sm">⭐</span>
                <span className="text-sm font-bold" style={{ color: ACC }}>Score Trust 850</span>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                  ✓ Identité vérifiée
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(224,92,26,0.12)', color: ACC }}>
                  🛡 Compte sécurisé
                </span>
              </div>
            </div>

            <div className="mt-5 pt-5 grid grid-cols-3 gap-2 text-center"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { val: '8',  label: 'Annonces' },
                { val: '45', label: 'Messages'  },
                { val: '3',  label: 'Avis'      },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-bold text-base text-white">{s.val}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl overflow-hidden"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { href: '/messages', icon: '💬', label: 'Messagerie'         },
              { href: '/finance',  icon: '💰', label: 'KangaPay'           },
              { href: '/publish',  icon: '+',  label: 'Publier une annonce' },
              { href: '/outils',   icon: '🧾', label: 'NKISI — Factures'   },
            ].map((item, i) => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/5"
                style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-white">{item.label}</span>
                <span className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>→</span>
              </Link>
            ))}
          </div>

          <button className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(239,68,68,0.30)', color: '#EF4444' }}>
            Se déconnecter
          </button>
        </div>

        {/* Right: Tabs */}
        <div className="flex-1 min-w-0">

          <div className="flex gap-0 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { id: 'notifs',   label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
              { id: 'annonces', label: 'Mes annonces' },
              { id: 'settings', label: 'Paramètres'   },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                className="px-4 py-2.5 text-sm font-medium transition-all -mb-px whitespace-nowrap"
                style={{
                  borderBottom: `2px solid ${tab === t.id ? ACC : 'transparent'}`,
                  color: tab === t.id ? ACC : 'rgba(255,255,255,0.40)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Notifications */}
          {tab === 'notifs' && (
            <div className="space-y-3">
              {NOTIFS.map((n, i) => (
                <div key={i}
                     className="rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all hover:-translate-y-0.5"
                     style={{
                       backgroundColor: n.unread ? '#242424' : '#1E1E1E',
                       border: `1px solid ${n.unread ? 'rgba(224,92,26,0.15)' : 'rgba(255,255,255,0.05)'}`,
                     }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                       style={{ backgroundColor: `${n.color}18` }}>
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ACC }} />
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{n.desc}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 text-sm font-medium rounded-xl transition-all hover:bg-white/5"
                      style={{ border: `1px solid ${ACC}`, color: ACC }}>
                Voir toutes les notifications
              </button>
            </div>
          )}

          {/* Mes annonces */}
          {tab === 'annonces' && (
            <div className="space-y-3">
              {MY_LISTINGS.map((l) => (
                <div key={l.id}
                     className="rounded-xl p-4 flex items-center gap-4"
                     style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, #2D2D2D, #383838)' }}>
                    🏠
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{l.title}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: ACC }}>{l.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: l.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(224,92,26,0.15)',
                              color: l.status === 'active' ? '#22C55E' : ACC,
                            }}>
                        {l.status === 'active' ? '● Active' : '⏳ En attente'}
                      </span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        👁 {l.views} vues
                      </span>
                    </div>
                  </div>
                  <button className="text-sm font-medium" style={{ color: ACC }}>Éditer →</button>
                </div>
              ))}
              <Link href="/publish"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: ACC, boxShadow: '0 2px 8px rgba(224,92,26,0.30)' }}>
                + Publier une nouvelle annonce
              </Link>
            </div>
          )}

          {/* Settings */}
          {tab === 'settings' && (
            <div className="space-y-4">
              <div className="rounded-xl p-5"
                   style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="font-semibold text-sm text-white mb-4">Informations personnelles</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Nom complet', value: 'Jean-Pierre Mutombo', type: 'text' },
                    { label: 'Téléphone',   value: '+243 81 234 5678',    type: 'tel'  },
                    { label: 'Ville',       value: 'Kinshasa',            type: 'text' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs font-medium mb-1.5"
                             style={{ color: 'rgba(255,255,255,0.55)' }}>{f.label}</label>
                      <input type={f.type} defaultValue={f.value}
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                        style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
                    </div>
                  ))}
                </div>
                <button className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: ACC }}>
                  Enregistrer
                </button>
              </div>

              <div className="rounded-xl p-5"
                   style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="font-semibold text-sm text-white mb-4">Sécurité</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Vérification en 2 étapes', desc: 'Activée via SMS', enabled: true  },
                    { label: 'Notifications push',        desc: 'Activées',        enabled: true  },
                    { label: 'Emails marketing',          desc: 'Désactivés',      enabled: false },
                  ].map((opt) => (
                    <div key={opt.label}
                         className="flex items-center justify-between py-2"
                         style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p className="text-sm font-medium text-white">{opt.label}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{opt.desc}</p>
                      </div>
                      <div className="w-10 h-6 rounded-full flex items-center px-0.5 transition-all"
                           style={{ backgroundColor: opt.enabled ? ACC : 'rgba(255,255,255,0.12)' }}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${opt.enabled ? 'ml-4' : 'ml-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
