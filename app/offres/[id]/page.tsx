"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { Offre, Resultat } from "@/types";

export default function DetailOffrePage() {
  const params = useParams();
  const offreId = params.id as string;

  const [offre, setOffre] = useState<Offre | null>(null);
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [codeCv, setCodeCv] = useState("");
  const [chargement, setChargement] = useState(true);
  const [matching, setMatching] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  async function chargerDonnees() {
    try {
      const [offreData, resultatsData] = await Promise.all([
        apiFetch<Offre>(`/api/v1/offres/${offreId}`),
        apiFetch<Resultat[]>(`/api/v1/offres/${offreId}/resultats`),
      ]);
      setOffre(offreData);
      setResultats(resultatsData);
    } catch {
      setErreur("Impossible de charger l'offre");
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerDonnees();
  }, [offreId]);

  async function handleMatching(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setSucces(null);
    setMatching(true);

    try {
      await apiFetch("/api/v1/offres/matching", {
        method: "POST",
        body: JSON.stringify({ code_cv: codeCv.toUpperCase(), id_offre: offreId }),
      });
      setSucces("CV évalué avec succès");
      setCodeCv("");
      await chargerDonnees();
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(typeof err.detail === "string" ? err.detail : "Erreur lors de l'évaluation");
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setMatching(false);
    }
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-600">Offre introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900">{offre.titre_offre}</h1>
          <p className="text-sm text-gray-500 mt-1">{offre.type_contrat || "—"}</p>
          {offre.resume_offre && <p className="text-sm text-gray-700 mt-3">{offre.resume_offre}</p>}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Évaluer un candidat par code CV</h2>
          <form onSubmit={handleMatching} className="flex gap-2">
            <input
              type="text"
              required
              value={codeCv}
              onChange={(e) => setCodeCv(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Code CV (ex: A1B2C3D4)"
            />
            <button
              type="submit"
              disabled={matching}
              className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {matching ? "..." : "Évaluer"}
            </button>
          </form>

          {erreur && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
              {erreur}
            </p>
          )}
          {succes && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-3">
              {succes}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Candidats évalués ({resultats.length})
          </h2>

          {resultats.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun candidat évalué pour l&apos;instant.</p>
          ) : (
            <div className="space-y-2">
              {resultats.map((r) => (
                <div
                  key={r.id_resultat}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-gray-700">Score : {r.score_sim.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">{r.statut_candidature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}