// ─── MABELE Copilot Agent ─────────────────────────────────────────────────────
// The user-visible assistant that guides users through the platform.
// Starts deterministic (rule-based routing), upgrades to LLM when configured.

import type { AgentHandler, AgentContext, AgentResult } from '../orchestrator/index'

const INTENT_PATTERNS: Array<{
  keywords: string[]
  intent: string
  route: string
  response: string
}> = [
  {
    keywords: ['maison', 'appartement', 'louer', 'acheter', 'immobilier', 'terrain', 'villa'],
    intent: 'immo',
    route: '/immo',
    response: 'Je vous guide vers les annonces immobilières. Vous cherchez à louer ou acheter ?',
  },
  {
    keywords: ['emploi', 'travail', 'job', 'poste', 'recrutement', 'cv', 'candidature'],
    intent: 'emploi',
    route: '/emploi',
    response: 'Voici les offres d\'emploi disponibles. Quel secteur vous intéresse ?',
  },
  {
    keywords: ['acheter', 'vendre', 'produit', 'marché', 'market'],
    intent: 'market',
    route: '/market',
    response: 'Bienvenue sur le Marché MABELE. Que souhaitez-vous acheter ou vendre ?',
  },
  {
    keywords: ['payer', 'envoyer', 'transfert', 'argent', 'airtel', 'orange', 'mpesa', 'kangapay'],
    intent: 'kangapay',
    route: '/finance',
    response: 'KangaPay est votre service de paiement. Que souhaitez-vous faire ?',
  },
  {
    keywords: ['facture', 'devis', 'facturation', 'sink', 'comptabilité'],
    intent: 'sink',
    route: '/outils',
    response: 'SINK est votre outil de facturation. Créez des devis et factures professionnels.',
  },
  {
    keywords: ['agri', 'agriculture', 'ferme', 'produit agricole', 'récolte'],
    intent: 'agri',
    route: '/agri',
    response: 'Bienvenue sur AgriTech MABELE. Acheteurs et producteurs connectés.',
  },
]

class MabeleCopilot implements AgentHandler {
  async run(ctx: AgentContext): Promise<AgentResult> {
    const input = (ctx.input.message as string ?? '').toLowerCase()

    // Try to match an intent
    for (const pattern of INTENT_PATTERNS) {
      if (pattern.keywords.some((kw) => input.includes(kw))) {
        return {
          success: true,
          output: {
            intent: pattern.intent,
            message: pattern.response,
            route: pattern.route,
            action: 'navigate',
          },
        }
      }
    }

    // Fallback: general help
    return {
      success: true,
      output: {
        intent: 'help',
        message:
          'Bienvenue sur MABELE ! Je suis ici pour vous aider. Vous pouvez chercher un appartement, trouver un emploi, envoyer de l\'argent via KangaPay, ou publier une annonce. Que puis-je faire pour vous ?',
        options: [
          { label: 'Immobilier', route: '/immo' },
          { label: 'Emploi', route: '/emploi' },
          { label: 'KangaPay', route: '/finance' },
          { label: 'Marché', route: '/market' },
        ],
      },
    }
  }
}

export const copilotAgent = new MabeleCopilot()
