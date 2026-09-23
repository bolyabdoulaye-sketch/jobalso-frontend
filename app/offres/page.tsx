"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { logout } from "@/lib/auth";
import type { Offre } from "@/types";

export default function OffresPage() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Offre[]>("/api/v1/offres/")
      .then(setOffres)
      .catch(() => setErreur("Impossible de charger les offres"))
      .finally(() => setChargement(false));
  }, []);

  const bgPage: React.CSSProperties = {
    background:
      "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.10), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.10), transparent 60%), #F7FAFD",
  };

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={bgPage}>
        <p className="text-sm font-semibold" style={{ color: "#587B95" }}>
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={bgPage}>
      <header className="bg-white" style={{ borderBottom: "1px solid #DCE7F0" }}>
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-extrabold" style={{ fontSize: "18px", color: "#10202E" }}>
              Jobalso
            </p>
            <p className="text-xs font-semibold" style={{ color: "#587B95" }}>
              Espace recruteur
            </p>
          </div>
          <button
            onClick={() => logout("RECRUTEUR")}
            className="text-sm font-semibold transition-colors"
            style={{ color: "#587B95" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#10202E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#587B95")}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-extrabold" style={{ fontSize: "24px", color: "#10202E" }}>
            Vos offres
          </h1>
          <Link
            href="/offres/nouvelle"
            className="text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)" }}
          >
            Publier une offre
          </Link>
        </div>

        {erreur && (
          <p
            className="text-sm rounded-lg px-3 py-2 mb-4"
            style={{ color: "#B4232C", background: "#FDEDEE", border: "1px solid #F6C6C9" }}
          >
            {erreur}
          </p>
        )}

        {offres.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-12 text-center"
            style={{ border: "1px solid #DCE7F0", boxShadow: "0 8px 20px rgba(6,20,32,0.06)" }}
          >
            <p className="font-extrabold" style={{ fontSize: "17px", color: "#10202E" }}>
              Aucune offre publiée
            </p>
            <p className="text-sm mt-1" style={{ color: "#587B95" }}>
              Créez votre première offre pour commencer à recevoir des candidats.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {offres.map((offre) => (
              <Link
                key={offre.id_offre}
                href={`/offres/${offre.id_offre}`}
                className="flex items-center justify-between bg-white rounded-xl px-5 py-4 transition-colors"
                style={{
                  border: "1px solid #DCE7F0",
                  borderLeft: `3px solid ${offre.status ? "#187ACD" : "#DCE7F0"}`,
                  boxShadow: "0 8px 20px rgba(6,20,32,0.04)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#DCE7F0";
                  e.currentTarget.style.borderLeftColor = offre.status ? "#187ACD" : "#DCE7F0";
                }}
              >
                <div>
                  <h3 className="font-semibold" style={{ color: "#10202E" }}>
                    {offre.titre_offre}
                  </h3>
                  <p className="text-sm" style={{ color: "#587B95" }}>
                    {offre.type_contrat || "Type non précisé"}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={
                    offre.status
                      ? { color: "#0F7A5C", background: "#E9F8F2" }
                      : { color: "#587B95", background: "#F1F5F8" }
                  }
                >
                  {offre.status ? "Active" : "Fermée"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
