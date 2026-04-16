'use client'
// ─── Messagerie ───────────────────────────────────────────────────────────────
// Source: Board 2 — "Messagerie Sécurisée"
import { useState } from 'react'

const CONVERSATIONS = [
  { id:'1', name:'Nadine N.',    avatar:'N', msg:'Merci, je confirme pour demain.',     time:'5 min',  unread:2, verified:true,  online:true  },
  { id:'2', name:'Jean Mukoko', avatar:'J', msg:'Le bien est encore disponible ?',      time:'12 min', unread:0, verified:true,  online:false },
  { id:'3', name:'Marie K.',    avatar:'M', msg:'Envoyez-moi les détails du prix svp.', time:'1h',     unread:1, verified:false, online:true  },
  { id:'4', name:'Paul N.',     avatar:'P', msg:'J\'ai payé via KangaPay.',             time:'3h',     unread:0, verified:true,  online:false },
  { id:'5', name:'Sofia T.',    avatar:'S', msg:'Bonjour, l\'annonce est toujours dispo?', time:'1j', unread:0, verified:false, online:false },
]

const MESSAGES: Record<string, { from:'me'|'them', text:string, time:string }[]> = {
  '1': [
    { from:'them', text:'Bonjour, je suis intéressée par votre appartement à Gombe.', time:'10h12' },
    { from:'me',   text:'Bonjour Nadine ! Oui il est toujours disponible.', time:'10h15' },
    { from:'them', text:'Quel est le loyer exact avec les charges ?', time:'10h16' },
    { from:'me',   text:'5 000 $/mois, charges incluses (eau, électricité). Gardien 24/7.', time:'10h18' },
    { from:'them', text:'Merci, je confirme pour demain.', time:'10h20' },
  ],
}

export default function MessagesPage() {
  const [active, setActive] = useState<string | null>(null)
  const [text,   setText]   = useState('')

  const conv = CONVERSATIONS.find(c => c.id === active)
  const msgs = active ? (MESSAGES[active] ?? []) : []

  return (
    <div className="flex h-[calc(100dvh-56px)] lg:h-[calc(100dvh-56px)]" style={{ overflow: 'hidden' }}>

      {/* Conversation list */}
      <div className={`flex-shrink-0 bg-white flex flex-col ${active ? 'hidden lg:flex' : 'flex'} w-full lg:w-80`}
           style={{ borderRight: '1px solid #E8EEF4' }}>
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #E8EEF4' }}>
          <h1 className="font-semibold text-base mb-3" style={{ color: '#0C1E47' }}>Messagerie Sécurisée</h1>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#8FA4BA' }}>🔍</span>
            <input placeholder="Rechercher..." className="w-full pl-8 pr-3 py-2 text-sm rounded-lg focus:outline-none"
                   style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', color: '#0C1E47' }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
              style={{ backgroundColor: active === c.id ? '#F5F8FC' : 'white', borderBottom: '1px solid #F5F8FC' }}>
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                     style={{ backgroundColor: '#1B4FB3' }}>{c.avatar}</div>
                {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate" style={{ color: '#0C1E47' }}>{c.name}</p>
                  <p className="text-[10px] flex-shrink-0 ml-2" style={{ color: '#8FA4BA' }}>{c.time}</p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {c.verified && <span className="text-[10px] font-semibold" style={{ color: '#16A34A' }}>✓</span>}
                  <p className="text-xs truncate" style={{ color: '#8FA4BA' }}>{c.msg}</p>
                </div>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#1B4FB3' }}>{c.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      {active && conv ? (
        <div className="flex-1 flex flex-col bg-white lg:flex">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 h-14 flex-shrink-0"
               style={{ borderBottom: '1px solid #E8EEF4', boxShadow: '0 1px 4px rgba(12,30,71,0.04)' }}>
            <button className="lg:hidden" onClick={() => setActive(null)} style={{ color: '#3D526B' }}>←</button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                 style={{ backgroundColor: '#1B4FB3' }}>{conv.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: '#0C1E47' }}>{conv.name}</p>
              <p className="text-xs" style={{ color: conv.online ? '#16A34A' : '#8FA4BA' }}>
                {conv.online ? '● En ligne' : 'Hors ligne'}
                {conv.verified && ' · ✓ Vérifié'}
              </p>
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#F5F8FC', color: '#3D526B' }}>⋯</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#F5F8FC' }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                     style={{
                       backgroundColor: m.from === 'me' ? '#1B4FB3' : '#FFFFFF',
                       color:           m.from === 'me' ? 'white'    : '#0C1E47',
                       borderBottomRightRadius: m.from === 'me' ? '4px' : undefined,
                       borderBottomLeftRadius:  m.from === 'them' ? '4px' : undefined,
                       boxShadow: '0 1px 4px rgba(12,30,71,0.08)',
                     }}>
                  <p>{m.text}</p>
                  <p className="text-[10px] mt-1 text-right"
                     style={{ color: m.from === 'me' ? 'rgba(255,255,255,0.60)' : '#8FA4BA' }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="px-4 py-3 flex-shrink-0 bg-white" style={{ borderTop: '1px solid #E8EEF4' }}>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#F5F8FC', color: '#8FA4BA' }}>📎</button>
              <input value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Écrire un message..." className="flex-1 px-4 py-2.5 rounded-full text-sm focus:outline-none"
                style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', color: '#0C1E47' }} />
              <button disabled={!text}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{ backgroundColor: text ? '#1B4FB3' : '#E8EEF4', color: text ? 'white' : '#8FA4BA' }}
                onClick={() => setText('')}>
                ➤
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center" style={{ backgroundColor: '#F5F8FC' }}>
          <div className="text-center">
            <div className="text-5xl mb-3">💬</div>
            <p className="font-semibold" style={{ color: '#0C1E47' }}>Sélectionnez une conversation</p>
            <p className="text-sm mt-1" style={{ color: '#8FA4BA' }}>Vos messages apparaîtront ici</p>
          </div>
        </div>
      )}
    </div>
  )
}
