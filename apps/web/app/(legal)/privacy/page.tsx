import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données de MABELE',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-gradient-gold">MABELE</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Confidentialité</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Politique de Confidentialité
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Dernière mise à jour : 12 avril 2026 · Version 1.0
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Qui sommes-nous ?</h2>
            <p className="text-muted-foreground leading-relaxed">
              MABELE est une plateforme digitale opérée par TechFlow Solutions SARL, Kinshasa,
              République Démocratique du Congo. Nous agissons en tant que responsable du traitement
              de vos données personnelles conformément aux lois applicables en RDC.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Données que nous collectons</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Identité :</strong> nom, numéro de téléphone, adresse e-mail</li>
              <li><strong className="text-foreground">Localisation :</strong> ville, province, coordonnées GPS (avec votre autorisation)</li>
              <li><strong className="text-foreground">Transactions :</strong> historique des paiements, références de transactions</li>
              <li><strong className="text-foreground">Contenu :</strong> annonces, photos, messages, avis</li>
              <li><strong className="text-foreground">Techniques :</strong> adresse IP, type d'appareil, navigateur, logs de connexion</li>
              <li><strong className="text-foreground">KYC :</strong> pièce d'identité, selfie (pour les vérifications)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Comment nous utilisons vos données</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Fournir et améliorer les services MABELE</li>
              <li>Authentification et sécurité du compte</li>
              <li>Traitement des paiements et transactions</li>
              <li>Vérification d'identité (KYC) pour les services financiers</li>
              <li>Personnalisation des recommandations</li>
              <li>Lutte contre la fraude et le blanchiment</li>
              <li>Communication d'informations importantes sur votre compte</li>
              <li>Amélioration de l'expérience utilisateur par des analyses agrégées</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Partage de données</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Nous ne vendons jamais vos données personnelles. Nous pouvons les partager avec :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Prestataires de paiement (Airtel Money, Orange Money) pour le traitement des transactions</li>
              <li>Prestataires d'infrastructure (hébergement, stockage cloud)</li>
              <li>Autorités légales sur demande formelle et légale</li>
              <li>Partenaires vérifiés avec votre consentement explicite</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Sécurité des données</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données : chiffrement en transit (TLS), chiffrement au repos pour les
              données sensibles, contrôle d'accès basé sur les rôles, journaux d'audit pour toutes
              les actions critiques, et surveillance continue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Conservation des données</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous conservons vos données aussi longtemps que votre compte est actif ou que la loi
              l'exige. Les données de transaction sont conservées 7 ans pour des raisons légales.
              Les données de compte inactif sont supprimées après 24 mois d'inactivité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Vos droits</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Accès :</strong> obtenir une copie de vos données</li>
              <li><strong className="text-foreground">Rectification :</strong> corriger des données inexactes</li>
              <li><strong className="text-foreground">Suppression :</strong> demander la suppression de votre compte</li>
              <li><strong className="text-foreground">Opposition :</strong> vous opposer à certains traitements</li>
              <li><strong className="text-foreground">Portabilité :</strong> recevoir vos données dans un format structuré</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Cookies et technologies similaires</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous utilisons des cookies essentiels pour le fonctionnement de la plateforme (session,
              sécurité). Nous pouvons utiliser des cookies analytiques anonymisés pour comprendre
              comment les utilisateurs utilisent MABELE. Vous pouvez gérer vos préférences via les
              paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Mineurs</h2>
            <p className="text-muted-foreground leading-relaxed">
              MABELE n'est pas destiné aux enfants de moins de 16 ans. Nous ne collectons pas
              sciemment de données personnelles concernant des mineurs sans le consentement parental.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact DPO</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour exercer vos droits ou pour toute question relative à la protection de vos données :{' '}
              <span className="text-primary">privacy@mabele.cd</span>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-6">
          <Link href="/terms" className="hover:text-primary transition-colors">Conditions</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link>
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
        </div>
      </footer>
    </div>
  )
}
