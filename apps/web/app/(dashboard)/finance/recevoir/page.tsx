import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Recevoir — KangaPay' }
export default function RecevoirPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor:'#F5F8FC'}}>
      <header className="sticky top-0 z-30 bg-white" style={{borderBottom:'1px solid #E8EEF4',boxShadow:'0 1px 4px rgba(12,30,71,0.06)'}}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/finance" className="w-9 h-9 flex items-center justify-center rounded-lg" style={{color:'#3D526B',backgroundColor:'#F5F8FC'}}>←</Link>
          <h1 className="font-semibold text-base" style={{color:'#0C1E47'}}>Recevoir Argent</h1>
        </div>
      </header>
      <div className="p-6 max-w-sm mx-auto text-center space-y-5">
        <p className="text-sm" style={{color:'#8FA4BA'}}>Partagez votre QR code pour recevoir de l'argent</p>
        {/* QR code placeholder */}
        <div className="bg-white rounded-2xl p-6 mx-auto w-fit" style={{border:'1px solid #E8EEF4',boxShadow:'0 4px 20px rgba(12,30,71,0.08)'}}>
          <div className="w-52 h-52 flex items-center justify-center rounded-xl relative"
               style={{border:'3px solid #0C1E47',backgroundColor:'#FFFFFF'}}>
            {/* Corner markers */}
            {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map(pos => (
              <div key={pos} className={`absolute ${pos} w-8 h-8 border-4 rounded-sm`}
                   style={{borderColor:'#0C1E47',margin:'4px',
                     borderRight: pos.includes('right') ? undefined : 'none',
                     borderLeft:  pos.includes('left')  ? undefined : 'none',
                     borderBottom: pos.includes('bottom') ? undefined : 'none',
                     borderTop:    pos.includes('top')    ? undefined : 'none',
                   }} />
            ))}
            <div className="text-5xl">▪</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4" style={{border:'1px solid #E8EEF4'}}>
          <p className="text-xs mb-1" style={{color:'#8FA4BA'}}>Mon numéro</p>
          <p className="font-bold text-lg" style={{color:'#0C1E47'}}>+243 81 234 5678</p>
          <p className="text-xs mt-1" style={{color:'#8FA4BA'}}>JP Mutombo · KangaPay</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
              style={{backgroundColor:'#DCFCE7',color:'#16A34A',border:'1px solid #16A34A30'}}>
          ✓ Paiement sécurisé
        </span>
        <button className="w-full py-3.5 rounded-xl text-sm font-bold"
                style={{backgroundColor:'#F5A623',color:'#0C1E47',boxShadow:'0 4px 16px rgba(245,166,35,0.30)'}}>
          ⬆ Partager mon QR
        </button>
      </div>
    </div>
  )
}
