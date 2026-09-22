"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { Offre, OffrePayload } from "@/types";

export default function NouvelleOffrePage() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [typeContrat, setTypeContrat] = useState("");
  const [revenu, setRevenu] = useState("");
  const [resume, setResume] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    const payload: OffrePayload = {
      titre_offre: titre,
      type_contrat: typeContrat || undefined,
      revenu: revenu ? parseFloat(revenu) : undefined,
      resume_offre: resume || undefined,
    };

    try {
      const offre = await apiFetch<Offre>("/api/v1/offres/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      router.push(`/offres/${offre.id_offre}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(typeof err.detail === "string" ? err.detail : "Erreur lors de la création");
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Nouvelle offre</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste</label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Développeur Backend Python"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
            <input
              type="text"
              value={typeContrat}
              onChange={(e) => setTypeContrat(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="CDI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Revenu proposé</label>
            <input
              type="number"
              value={revenu}
              onChange={(e) => setRevenu(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="45000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Décrivez le poste"
            />
          </div>

          {erreur && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {chargement ? "Création..." : "Publier l'offre"}
          </button>
        </form>
      </div>
    </div>
  );
}