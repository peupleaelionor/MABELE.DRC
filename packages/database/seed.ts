import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding MABELE database...')

  // --- Users ---
  const user1 = await prisma.user.upsert({
    where: { phone: '+243810000001' },
    update: {},
    create: {
      phone: '+243810000001',
      email: 'jean.pierre@example.com',
      name: 'Jean-Pierre Mutombo',
      role: 'USER',
      province: 'Kinshasa',
      ville: 'Kinshasa',
      isVerified: true,
    },
  })

  const agentImmo = await prisma.user.upsert({
    where: { phone: '+243820000002' },
    update: {},
    create: {
      phone: '+243820000002',
      email: 'agent.immo@example.com',
      name: 'Marie Kabila',
      role: 'AGENT_IMMO',
      province: 'Kinshasa',
      ville: 'Kinshasa',
      isVerified: true,
    },
  })

  const employer = await prisma.user.upsert({
    where: { phone: '+243840000003' },
    update: {},
    create: {
      phone: '+243840000003',
      email: 'techflow@example.com',
      name: 'TechFlow Solutions',
      role: 'EMPLOYER',
      province: 'Kinshasa',
      ville: 'Kinshasa',
      isVerified: true,
    },
  })

  const farmer = await prisma.user.upsert({
    where: { phone: '+243890000004' },
    update: {},
    create: {
      phone: '+243890000004',
      name: 'Pierre Agrikole',
      role: 'FARMER',
      province: 'Nord-Kivu',
      ville: 'Butembo',
      isVerified: false,
    },
  })

  console.log('✅ Users created')

  // --- ImmoListings ---
  await prisma.immoListing.createMany({
    data: [
      {
        type: 'VILLA',
        action: 'VENTE',
        titre: 'Belle villa avec piscine à Gombe',
        description: 'Magnifique villa de standing avec piscine, jardin et garage. Quartier résidentiel sécurisé de Gombe.',
        prix: 450000,
        devise: 'USD',
        ville: 'Kinshasa',
        quartier: 'Gombe',
        province: 'Kinshasa',
        surface: 400,
        chambres: 5,
        sallesBain: 3,
        parking: true,
        gardien: true,
        eauChaude: true,
        internet: true,
        electrogen: true,
        titreVerifie: true,
        photos: ['https://images.unsplash.com/photo-1613977257363-707ba9348227'],
        userId: agentImmo.id,
      },
      {
        type: 'APPARTEMENT',
        action: 'LOCATION',
        titre: 'Appartement meublé 3 chambres à Lingwala',
        description: 'Appartement entièrement meublé et équipé, climatisé, avec groupé électrogène et eau chaude.',
        prix: 1200,
        devise: 'USD',
        ville: 'Kinshasa',
        quartier: 'Lingwala',
        province: 'Kinshasa',
        surface: 120,
        chambres: 3,
        sallesBain: 2,
        meuble: true,
        gardien: true,
        electrogen: true,
        eauChaude: true,
        internet: true,
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
        userId: agentImmo.id,
      },
      {
        type: 'TERRAIN',
        action: 'VENTE',
        titre: 'Terrain 1000m² à Ngaliema avec titre foncier',
        description: 'Grand terrain plat avec titre foncier authentique. Idéal pour construction villa ou immeuble.',
        prix: 85000,
        devise: 'USD',
        ville: 'Kinshasa',
        quartier: 'Ngaliema',
        province: 'Kinshasa',
        surface: 1000,
        chambres: 0,
        sallesBain: 0,
        titreVerifie: true,
        photos: [],
        userId: agentImmo.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Immo listings created')

  // --- Job Postings ---
  await prisma.jobPosting.createMany({
    data: [
      {
        titre: 'Développeur Full Stack React/Node.js',
        description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe. Technologies: React, Next.js, Node.js, TypeScript, PostgreSQL.',
        entreprise: 'TechFlow Solutions',
        ville: 'Kinshasa',
        province: 'Kinshasa',
        type: 'CDI',
        categorie: 'IT & Tech',
        salaireMin: 1500,
        salaireMax: 2500,
        devise: 'USD',
        experience: '3+ ans',
        competences: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js'],
        urgent: true,
        remote: true,
        userId: employer.id,
      },
      {
        titre: 'Comptable Senior OHADA',
        description: 'Poste de comptable senior pour cabinet comptable en expansion. Maîtrise du référentiel OHADA indispensable.',
        entreprise: 'Banque Commerciale du Congo',
        ville: 'Kinshasa',
        province: 'Kinshasa',
        type: 'CDI',
        categorie: 'Finance',
        salaireMin: 1000,
        salaireMax: 1800,
        devise: 'USD',
        experience: '5+ ans',
        competences: ['OHADA', 'Excel', 'SAP', 'Fiscalité DRC'],
        urgent: false,
        remote: false,
        userId: employer.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Job postings created')

  // --- Market Items ---
  await prisma.marketItem.createMany({
    data: [
      {
        nom: 'iPhone 13 Pro 256GB — Excellent état',
        description: 'iPhone 13 Pro 256GB, couleur graphite. Acheté il y a 18 mois, parfait état, avec boîte et chargeur original.',
        categorie: 'Électronique',
        prix: 750,
        devise: 'USD',
        etat: 'OCCASION',
        ville: 'Kinshasa',
        province: 'Kinshasa',
        photos: [],
        userId: user1.id,
      },
      {
        nom: 'Toyota Corolla 2018 — 45 000 km',
        description: 'Toyota Corolla 2018, 1.8L essence, automatique. 45 000 km, carnet entretien complet, pas d\'accident.',
        categorie: 'Véhicules',
        prix: 18500,
        devise: 'USD',
        etat: 'OCCASION',
        ville: 'Kinshasa',
        province: 'Kinshasa',
        photos: [],
        userId: user1.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Market items created')

  // --- Agri Products ---
  await prisma.agriProduct.createMany({
    data: [
      {
        produit: 'Café Arabica',
        description: 'Café Arabica de qualité supérieure, cultivé en altitude dans les montagnes du Nord-Kivu.',
        quantite: 500,
        unite: 'kg',
        prixUnitaire: 4.5,
        devise: 'USD',
        ville: 'Butembo',
        province: 'Nord-Kivu',
        bio: true,
        certifie: true,
        photos: [],
        userId: farmer.id,
      },
      {
        produit: 'Maïs séché',
        description: 'Maïs séché de bonne qualité, prêt pour mouture ou consommation directe.',
        quantite: 50,
        unite: 'sac (50kg)',
        prixUnitaire: 25,
        devise: 'USD',
        ville: 'Bukavu',
        province: 'Sud-Kivu',
        bio: false,
        certifie: false,
        photos: [],
        userId: farmer.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Agri products created')

  // --- Invoice ---
  await prisma.invoice.upsert({
    where: { numero: 'FAC-2025-001' },
    update: {},
    create: {
      numero: 'FAC-2025-001',
      clientNom: 'SARL Congo Build',
      clientPhone: '+243810000099',
      clientEmail: 'contact@congobuild.cd',
      items: [
        { description: 'Développement site web', quantite: 1, prix: 3000, total: 3000 },
        { description: 'Hébergement annuel', quantite: 1, prix: 500, total: 500 },
      ],
      sousTotal: 3500,
      taxe: 0,
      total: 3500,
      devise: 'USD',
      status: 'PAID',
      paidAt: new Date('2025-01-10'),
      paidVia: 'Airtel Money',
      userId: user1.id,
    },
  })

  console.log('✅ Invoice created')

  // --- Tontine Group ---
  const tontine = await prisma.tontineGroup.create({
    data: {
      nom: 'Groupe Lingala Business',
      description: 'Tontine mensuelle pour entrepreneurs kinois',
      montant: 100,
      devise: 'USD',
      frequence: 'MENSUEL',
      maxMembres: 12,
    },
  }).catch(() => null)

  if (tontine) {
    await prisma.tontineGroupMember.createMany({
      data: [
        { groupId: tontine.id, userId: user1.id, role: 'ADMIN', score: 100 },
        { groupId: tontine.id, userId: agentImmo.id, role: 'MEMBER', score: 98 },
      ],
      skipDuplicates: true,
    })
    console.log('✅ Tontine group created')
  }

  console.log('\n🎉 Database seeded successfully!')
  console.log(`   Users: 4`)
  console.log(`   Immo listings: 3`)
  console.log(`   Job postings: 2`)
  console.log(`   Market items: 2`)
  console.log(`   Agri products: 2`)
  console.log(`   Invoices: 1`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
