"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { logout } from "@/lib/auth";
import type { CV, CVPayload } from "@/types";

export default function CVPage() {
  const [cv, setCv] = useState<CV | null>(null);
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  const [resumeCv, setResumeCv] = useState("");
  const [competences, setCompetences] = useState("");
  const [langues, setLangues] = useState("");

  useEffect(() => {
    apiFetch<CV>("/api/v1/cv/moi")
      .then((data) => {
        setCv(data);
        setResumeCv(data.resume_cv || "");
        setCompetences(Array.isArray(data.competences) ? data.competences.join(", ") : "");
        setLangues(Array.isArray(data.langues) ? data.langues.join(", ") : "");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status !== 404) {
          setErreur("Impossible de charger le CV");
        }
      })
      .finally(() => setChargement(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setSucces(false);
    setEnregistrement(true);

    const payload: CVPayload = {
      resume_cv: resumeCv,
      competences: competences.split(",").map((c) => c.trim()).filter(Boolean),
      langues: langues.split(",").map((l) => l.trim()).filter(Boolean),
    };

    try {
      const method = cv ? "PUT" : "POST";
      const path = cv ? "/api/v1/cv/moi" : "/api/v1/cv/";
      const result = await apiFetch<CV>(path, {
        method,
        body: JSON.stringify(payload),
      });
      setCv(result);
      setSucces(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(typeof err.detail === "string" ? err.detail : "Erreur lors de l'enregistrement");
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setEnregistrement(false);
    }
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mon CV</h1>
            <p className="text-sm text-gray-500">Espace talent</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Déconnexion
          </button>
        </div>

        {cv && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <p className="text-sm text-gray-500">Code CV à partager aux recruteurs</p>
            <p className="text-2xl font-mono font-bold text-gray-900 mt-1">{cv.code_cv}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
            <textarea
              value={resumeCv}
              onChange={(e) => setResumeCv(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Décrivez votre profil en quelques lignes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compétences <span className="text-gray-400">(séparées par des virgules)</span>
            </label>
            <input
              type="text"
              value={competences}
              onChange={(e) => setCompetences(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Python, FastAPI, PostgreSQL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Langues <span className="text-gray-400">(séparées par des virgules)</span>
            </label>
            <input
              type="text"
              value={langues}
              onChange={(e) => setLangues(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Français, Anglais"
            />
          </div>

          {erreur && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erreur}
            </p>
          )}
          {succes && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              CV enregistré avec succès
            </p>
          )}

          <button
            type="submit"
            disabled={enregistrement}
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {enregistrement ? "Enregistrement..." : cv ? "Mettre à jour" : "Créer mon CV"}
          </button>
        </form>
      </div>
    </div>
  );
}