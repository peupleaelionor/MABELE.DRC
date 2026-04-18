export const DEFAULT_FEATURES: Record<string, { name: string; enabled: boolean; description: string }> = {
  immobilier: { name: 'Immobilier', enabled: true, description: 'Real estate listings' },
  emploi: { name: 'Emploi', enabled: true, description: 'Job postings' },
  marketplace: { name: 'Marché', enabled: true, description: 'Buy and sell marketplace' },
  agritech: { name: 'AgriTech', enabled: false, description: 'Agricultural marketplace' },
  sink: { name: 'SINK', enabled: false, description: 'Business tools (invoicing, etc.)' },
  congodata: { name: 'Congo Data', enabled: false, description: 'Economic data dashboards' },
  kangapay: { name: 'KangaPay', enabled: false, description: 'Mobile money and tontines' },
  bima: { name: 'Bima Santé', enabled: false, description: 'Health insurance' },
}
