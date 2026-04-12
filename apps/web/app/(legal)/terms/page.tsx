import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'Conditions d\'utilisation de la plateforme MABELE',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-gradient-gold">MABELE</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Conditions d'utilisation</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Dernière mise à jour : 12 avril 2026 · Version 1.0
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Présentation de MABELE</h2>
            <p className="text-muted-foreground leading-relaxed">
              MABELE est une super-plateforme digitale opérée par TechFlow Solutions SARL,
              société enregistrée en République Démocratique du Congo. MABELE offre aux citoyens
              congolais des services d'annonces immobilières, d'offres d'emploi, de commerce en ligne,
              de services agricoles, d'outils de facturation, de paiements mobiles (KangaPay),
              et d'assurance santé numérique (Bima Santé).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Acceptation des conditions</h2>
            <p className="text-muted-foreground leading-relaxed">
              En accédant à MABELE ou en créant un compte, vous acceptez d'être lié par les présentes
              Conditions Générales d'Utilisation, notre Politique de Confidentialité, et toute règle
              spécifique applicable aux modules que vous utilisez. Si vous n'acceptez pas ces conditions,
              vous ne pouvez pas utiliser la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Éligibilité</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour utiliser MABELE, vous devez : (a) avoir au moins 16 ans ou être accompagné d'un
              tuteur légal ; (b) fournir un numéro de téléphone valide en RDC ou à l'international ;
              (c) utiliser la plateforme conformément aux lois en vigueur en RDC et dans votre pays
              de résidence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Compte utilisateur</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vous êtes responsable de la confidentialité de votre code OTP et de toutes les
              activités effectuées sur votre compte. Vous vous engagez à nous informer immédiatement
              de toute utilisation non autorisée. MABELE ne peut être tenu responsable des pertes
              résultant de votre manquement à ces obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Utilisation acceptable</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Vous acceptez de NE PAS utiliser MABELE pour :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Publier des annonces frauduleuses, fausses ou trompeuses</li>
              <li>Vendre des biens ou services illégaux</li>
              <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
              <li>Effectuer du blanchiment d'argent ou des transactions illicites</li>
              <li>Contourner nos systèmes de sécurité ou de paiement</li>
              <li>Extraire automatiquement nos données (scraping) sans autorisation</li>
              <li>Diffuser des logiciels malveillants</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Annonces et contenu</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les vendeurs et annonceurs sont seuls responsables de l'exactitude et de la légalité
              de leurs annonces. MABELE se réserve le droit de supprimer tout contenu qui viole ces
              conditions ou qui est jugé inapproprié par notre équipe de modération. Nous ne garantissons
              pas la qualité ou la légalité des biens et services publiés par des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Paiements et KangaPay</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les transactions via KangaPay sont soumises à des conditions spécifiques de chaque
              prestataire de paiement mobile (Airtel Money, Orange Money, M-Pesa). MABELE n'est pas
              une institution financière. Nous facilitons les paiements entre utilisateurs mais ne
              garantissons pas le remboursement en cas de litige commercial entre acheteur et vendeur.
              Les transactions confirmées peuvent être soumises à des frais de service applicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Offres payantes pour les entreprises</h2>
            <p className="text-muted-foreground leading-relaxed">
              L'accès de base à MABELE est gratuit pour les citoyens. Certains services premium
              destinés aux entreprises (boostage d'annonces, outils marchands, analytiques avancées,
              vérifications, accès API) sont payants. Les tarifs en vigueur sont affichés dans la
              section Tarifs. Les abonnements sont renouvelables automatiquement sauf résiliation
              avant la date d'échéance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Propriété intellectuelle</h2>
            <p className="text-muted-foreground leading-relaxed">
              MABELE, son logo, son design, ses API et son code source sont la propriété exclusive
              de TechFlow Solutions SARL. Vous conservez les droits sur le contenu que vous publiez,
              mais vous nous accordez une licence mondiale, non exclusive, pour l'afficher, le diffuser
              et l'indexer dans le cadre des services MABELE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Limitation de responsabilité</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dans la mesure permise par la loi, MABELE n'est pas responsable des dommages indirects,
              accidentels ou consécutifs résultant de votre utilisation de la plateforme. Notre
              responsabilité totale ne peut excéder le montant que vous avez payé à MABELE au cours
              des 12 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Résiliation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vous pouvez supprimer votre compte à tout moment depuis les paramètres. Nous pouvons
              suspendre ou supprimer votre compte en cas de violation des présentes conditions, de
              fraude confirmée, ou d'inactivité prolongée de plus de 24 mois.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Droit applicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les présentes conditions sont régies par le droit de la République Démocratique du Congo.
              Tout litige sera soumis à la juridiction compétente de Kinshasa, RDC.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour toute question relative aux présentes conditions :{' '}
              <span className="text-primary">legal@mabele.cd</span>
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
