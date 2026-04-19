import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Recevoir — KangaPay' }

const ACC = '#E05C1A'

export default function RecevoirPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/finance"
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ color: 'rgba(255,255,255,0.60)', backgroundColor: 'rgba(255,255,255,0.06)' }}>←</Link>
          <h1 className="font-semibold text-base text-white">Recevoir Argent</h1>
        </div>
      </header>
      <div className="p-6 max-w-sm mx-auto text-center space-y-5">
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Partagez votre QR code pour recevoir de l'argent
        </p>
        {/* QR code */}
        <div className="rounded-2xl p-6 mx-auto w-fit"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}>
          <div className="w-52 h-52 flex items-center justify-center rounded-xl relative"
               style={{ border: `3px solid ${ACC}`, backgroundColor: '#2A2A2A' }}>
            {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map(pos => (
              <div key={pos} className={`absolute ${pos} w-8 h-8 border-4 rounded-sm`}
                   style={{
                     borderColor: ACC, margin:'4px',
                     borderRight:  pos.includes('right')  ? undefined : 'none',
                     borderLeft:   pos.includes('left')   ? undefined : 'none',
                     borderBottom: pos.includes('bottom') ? undefined : 'none',
                     borderTop:    pos.includes('top')    ? undefined : 'none',
                   }} />
            ))}
            <div className="text-5xl" style={{ color: ACC }}>▪</div>
          </div>
        </div>
        <div className="rounded-xl p-4"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Mon numéro</p>
          <p className="font-bold text-lg text-white">+243 81 234 5678</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>JP Mutombo · KangaPay</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
          ✓ Paiement sécurisé
        </span>
        <button className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
          ⬆ Partager mon QR
        </button>
      </div>
    </div>
  )
}
