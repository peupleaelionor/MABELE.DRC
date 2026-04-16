'use client'
import { useState } from 'react'
import Link from 'next/link'

type State = 'form' | 'confirm' | 'loading' | 'success' | 'error'

export default function EnvoyerPage() {
  const [state, setState] = useState<State>('form')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor:'#F5F8FC'}}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor:'#EBF0F7'}}>
          <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin block" style={{borderColor:'#D0DBE8',borderTopColor:'#1B4FB3'}}/>
        </div>
        <p className="font-semibold" style={{color:'#0C1E47'}}>Paiement en attente</p>
        <p className="text-sm mt-1" style={{color:'#8FA4BA'}}>En cours de validation...</p>
      </div>
    </div>
  )

  if (state === 'success') return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor:'#F5F8FC'}}>
      <div className="text-center max-w-xs w-full">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5" style={{backgroundColor:'#DCFCE7'}}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M14 24l8 8 14-16" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 className="font-display font-bold text-2xl mb-1" style={{color:'#0C1E47'}}>Paiement Réussi</h1>
        <p className="font-bold my-3" style={{color:'#16A34A',fontSize:'2rem'}}>{parseInt(amount).toLocaleString('fr')} CDF</p>
        <p className="text-sm" style={{color:'#8FA4BA'}}>Envoyé avec succès à +243 {phone}</p>
        <div className="mt-8 space-y-3">
          <button className="w-full py-3.5 rounded-xl text-sm font-bold" style={{backgroundColor:'#F5A623',color:'#0C1E47',boxShadow:'0 4px 16px rgba(245,166,35,0.30)'}}>
            📄 Voir le reçu
          </button>
          <Link href="/finance" className="w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center" style={{color:'#3D526B'}}>
            ← Retour au portefeuille
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{backgroundColor:'#F5F8FC'}}>
      <header className="sticky top-0 z-30 bg-white" style={{borderBottom:'1px solid #E8EEF4',boxShadow:'0 1px 4px rgba(12,30,71,0.06)'}}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/finance" className="w-9 h-9 flex items-center justify-center rounded-lg" style={{color:'#3D526B',backgroundColor:'#F5F8FC'}}>←</Link>
          <h1 className="font-semibold text-base" style={{color:'#0C1E47'}}>Envoyer Argent</h1>
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4 pb-32">
        <div className="bg-white rounded-2xl p-5" style={{border:'1px solid #E8EEF4',boxShadow:'0 1px 6px rgba(12,30,71,0.06)'}}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{color:'#3D526B'}}>Numéro du destinataire</label>
              <div className="flex rounded-xl overflow-hidden" style={{border:'1px solid #D0DBE8'}}>
                <div className="flex items-center gap-1.5 px-3 select-none flex-shrink-0" style={{backgroundColor:'#F5F8FC',borderRight:'1px solid #D0DBE8'}}>
                  <span>🇨🇩</span><span className="text-sm font-semibold" style={{color:'#0C1E47'}}>+243</span>
                </div>
                <input type="tel" inputMode="numeric" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,9))}
                  placeholder="81 234 5678" className="flex-1 px-3 py-3 text-sm bg-white focus:outline-none" style={{color:'#0C1E47'}}/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{color:'#3D526B'}}>Montant (CDF)</label>
              <div className="relative">
                <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
                  placeholder="0" className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none pr-16"
                  style={{border:'1px solid #D0DBE8',color:'#0C1E47',fontSize:'1.1rem',fontWeight:600}}/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{color:'#8FA4BA'}}>CDF</span>
              </div>
              {amount && <p className="text-xs mt-1" style={{color:'#8FA4BA'}}>≈ {(parseInt(amount)/2780).toFixed(2)} USD</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{color:'#3D526B'}}>Note (optionnel)</label>
              <input type="text" value={note} onChange={e=>setNote(e.target.value)}
                placeholder="Paiement loyer, dette..." className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{border:'1px solid #D0DBE8',color:'#0C1E47'}}/>
            </div>
          </div>
        </div>

        {amount && phone.length >= 9 && (
          <div className="bg-white rounded-2xl p-4" style={{border:'1px solid #E8EEF4'}}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:'#8FA4BA'}}>Résumé</p>
            {[
              ['Destinataire', `+243 ${phone}`],
              ['Montant', `${parseInt(amount).toLocaleString('fr')} CDF`],
              ['Frais KangaPay', '0 CDF'],
              ['Total débité', `${parseInt(amount).toLocaleString('fr')} CDF`],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1.5 text-sm" style={{borderBottom:'1px solid #F5F8FC'}}>
                <span style={{color:'#8FA4BA'}}>{k}</span>
                <span className="font-medium" style={{color:'#0C1E47'}}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4" style={{borderTop:'1px solid #E8EEF4'}}>
        <div className="max-w-lg mx-auto">
          <button disabled={!amount||phone.length<9}
            onClick={async()=>{setState('loading');await new Promise(r=>setTimeout(r,1500));setState('success')}}
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{backgroundColor:amount&&phone.length>=9?'#F5A623':'#E8EEF4',color:amount&&phone.length>=9?'#0C1E47':'#8FA4BA',boxShadow:amount&&phone.length>=9?'0 4px 16px rgba(245,166,35,0.30)':'none'}}>
            ✈ Envoyer {amount ? `${parseInt(amount).toLocaleString('fr')} CDF` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
