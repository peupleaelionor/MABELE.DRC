import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Historique — KangaPay' }
const TXS = [
  {icon:'💸',label:'Paiement loyer',   cat:'Logement',    amount:-260000,date:'Mar 3, 2024',ref:'TXN-2024-001'},
  {icon:'🌾',label:'Vente maïs',       cat:'AgriTech',    amount:150000, date:'Mar 2, 2024',ref:'TXN-2024-002'},
  {icon:'🤝',label:'Tontine mensuelle',cat:'Tontine',     amount:-100000,date:'Mar 1, 2024',ref:'TXN-2024-003'},
  {icon:'💵',label:'Versement reçu',   cat:'Transfert',   amount:500000, date:'Fév 28, 2024',ref:'TXN-2024-004'},
  {icon:'📤',label:'Transaction',      cat:'Commerce',    amount:-14500, date:'Fév 27, 2024',ref:'TXN-2024-005'},
  {icon:'🏠',label:'Caution appart.',  cat:'Immobilier',  amount:-600000,date:'Fév 25, 2024',ref:'TXN-2024-006'},
  {icon:'💰',label:'Salaire reçu',     cat:'Emploi',      amount:1250000,date:'Fév 24, 2024',ref:'TXN-2024-007'},
]
export default function HistoriquePage() {
  return (
    <div className="min-h-screen" style={{backgroundColor:'#F5F8FC'}}>
      <header className="sticky top-0 z-30 bg-white" style={{borderBottom:'1px solid #E8EEF4',boxShadow:'0 1px 4px rgba(12,30,71,0.06)'}}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/finance" className="w-9 h-9 flex items-center justify-center rounded-lg" style={{color:'#3D526B',backgroundColor:'#F5F8FC'}}>←</Link>
          <h1 className="font-semibold text-base" style={{color:'#0C1E47'}}>Historique des Transactions</h1>
        </div>
      </header>
      <div className="p-4 max-w-2xl mx-auto space-y-3">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          {[{label:'Total reçu',val:'+1.900.000',color:'#16A34A'},{label:'Total envoyé',val:'-974.500',color:'#DC2626'}].map(s=>(
            <div key={s.label} className="bg-white rounded-xl p-4 text-center" style={{border:'1px solid #E8EEF4'}}>
              <p className="text-xs mb-1" style={{color:'#8FA4BA'}}>{s.label}</p>
              <p className="font-bold text-lg" style={{color:s.color}}>{s.val} CDF</p>
            </div>
          ))}
        </div>
        {/* List */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{border:'1px solid #E8EEF4',boxShadow:'0 1px 6px rgba(12,30,71,0.05)'}}>
          {TXS.map((tx,i) => (
            <div key={tx.id||i} className="flex items-center gap-3 px-4 py-3.5" style={{borderBottom:i<TXS.length-1?'1px solid #F5F8FC':'none'}}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{backgroundColor:'#F5F8FC'}}>{tx.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{color:'#0C1E47'}}>{tx.label}</p>
                <p className="text-xs" style={{color:'#8FA4BA'}}>{tx.date} · {tx.ref}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold" style={{color:tx.amount>0?'#16A34A':'#DC2626'}}>
                  {tx.amount>0?'+':''}{tx.amount.toLocaleString('fr')}
                </p>
                <p className="text-[10px]" style={{color:'#8FA4BA'}}>CDF</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
