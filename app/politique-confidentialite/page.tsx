export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#10202E" }}>
          Politique de confidentialité
        </h1>
        <p className="text-sm mb-8" style={{ color: "#587B95" }}>
          Version 1.0 — dernière mise à jour : à compléter
        </p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: "#10202E" }}>
          <p>
            Jobalso s&apos;engage à protéger vos données personnelles conformément à la Loi 25
            (Québec) et, le cas échéant, au Règlement général sur la protection des données
            (RGPD).
          </p>

          <section>
            <h2 className="font-bold mb-2">Données collectées</h2>
            <p>
              Nous collectons votre nom, email, numéro de téléphone, et, selon votre profil,
              votre CV et vos informations d&apos;entreprise. Ces données servent uniquement à
              vous mettre en relation avec des offres ou des candidats pertinents.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">Vos droits</h2>
            <p>
              Vous pouvez à tout moment demander l&apos;accès, la rectification ou la suppression
              de vos données personnelles en nous contactant.
            </p>
          </section>

          <section>
            <h2 className="font-bold mb-2">Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire à l&apos;utilisation du
              service, puis supprimées selon notre politique de rétention.
            </p>
          </section>
        </div>

        <p className="text-xs mt-10" style={{ color: "#587B95" }}>
          ⚠️ Ce texte est un modèle temporaire. Il doit être révisé et validé par l&apos;équipe
          juridique avant le pilote (voir JA-092, hébergement conforme Québec).
        </p>
      </div>
    </div>
  );
}
