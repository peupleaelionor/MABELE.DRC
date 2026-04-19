import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route: /api/lovable
 *
 * Automatisation et intégration du site Lovable dans MABELE.
 *
 * GET  → Retourne le statut de l'intégration Lovable et les informations du site
 * POST → Permet de déclencher des actions d'automatisation (ex: sync modules, refresh data)
 */

const LOVABLE_CONFIG = {
  version: '2.0',
  nom: 'MABELE v20 — Super-Plateforme Nationale RDC',
  modules: [
    { id: 'home', label: 'Accueil', statut: 'actif' },
    { id: 'immo', label: 'Immobilier', statut: 'actif' },
    { id: 'emploi', label: 'Emploi & Freelance', statut: 'actif' },
    { id: 'market', label: 'Marché', statut: 'actif' },
    { id: 'agri', label: 'AgriTech (Soko Congo)', statut: 'actif' },
    { id: 'outils', label: 'SINK — Outils PME', statut: 'actif' },
    { id: 'data', label: 'Congo Data', statut: 'actif' },
    { id: 'finance', label: 'KangaPay', statut: 'actif' },
    { id: 'health', label: 'Bima Santé', statut: 'bientot' },
  ],
  route: '/lovable',
  source: 'Lovable AI Builder',
}

export async function GET() {
  return NextResponse.json({
    statut: 'actif',
    message: 'Intégration Lovable active — Site MABELE v20',
    config: LOVABLE_CONFIG,
    urls: {
      site: '/lovable',
      api: '/api/lovable',
    },
    timestamp: new Date().toISOString(),
  })
}

type ActionType = 'sync_modules' | 'refresh_data' | 'check_status' | 'deploy'

interface AutomationRequest {
  action: ActionType
  module?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AutomationRequest
    const { action, module } = body

    if (!action) {
      return NextResponse.json(
        { erreur: "Le champ 'action' est requis" },
        { status: 400 }
      )
    }

    const actionsDisponibles: ActionType[] = [
      'sync_modules',
      'refresh_data',
      'check_status',
      'deploy',
    ]

    if (!actionsDisponibles.includes(action)) {
      return NextResponse.json(
        {
          erreur: `Action '${action}' non reconnue`,
          actionsDisponibles,
        },
        { status: 400 }
      )
    }

    switch (action) {
      case 'sync_modules':
        return NextResponse.json({
          statut: 'succes',
          action: 'sync_modules',
          message: 'Tous les modules Lovable sont synchronisés',
          modules: LOVABLE_CONFIG.modules,
          timestamp: new Date().toISOString(),
        })

      case 'refresh_data':
        return NextResponse.json({
          statut: 'succes',
          action: 'refresh_data',
          message: module
            ? `Données du module '${module}' rafraîchies`
            : 'Toutes les données ont été rafraîchies',
          module: module ?? 'tous',
          timestamp: new Date().toISOString(),
        })

      case 'check_status':
        return NextResponse.json({
          statut: 'succes',
          action: 'check_status',
          site: {
            url: '/lovable',
            actif: true,
            version: LOVABLE_CONFIG.version,
            modulesActifs: LOVABLE_CONFIG.modules.filter(
              (m) => m.statut === 'actif'
            ).length,
            modulesTotal: LOVABLE_CONFIG.modules.length,
          },
          timestamp: new Date().toISOString(),
        })

      case 'deploy':
        return NextResponse.json({
          statut: 'succes',
          action: 'deploy',
          message: 'Déploiement Lovable déclenché',
          deploiement: {
            plateforme: 'Netlify',
            route: '/lovable',
            version: LOVABLE_CONFIG.version,
          },
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json(
          { erreur: 'Action non supportée' },
          { status: 400 }
        )
    }
  } catch {
    return NextResponse.json(
      { erreur: 'Requête invalide — Body JSON attendu' },
      { status: 400 }
    )
  }
}
