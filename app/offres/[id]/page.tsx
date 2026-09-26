"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { Offre, Resultat, NiveauCritere } from "@/types";

const STATUTS: { valeur: string; libelle: string }[] = [
  { valeur: "RECUE", libelle: "Candidature reçue" },
  { valeur: "EN_REVUE", libelle: "En cours d'examen" },
  { valeur: "ENTRETIEN", libelle: "Entretien" },
  { valeur: "DECISION", libelle: "Décision prise" },
];

const NIVEAUX_STYLE: Record<NiveauCritere, { libelle: string; color: string; background: string }> = {
  OBLIGATOIRE: { libelle: "Obligatoire", color: "#B4232C", background: "#FDEDEE" },
  IMPORTANT: { libelle: "Important", color: "#9A5B00", background: "#FFF1DB" },
  SOUHAITABLE: { libelle: "Souhaitable", color: "#587B95", background: "#F1F5F8" },
};

export default function DetailOffrePage() {
  const params = useParams();
  const offreId = params.id as string;

  const [offre, setOffre] = useState<Offre | null>(null);
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [codeCv, setCodeCv] = useState("");
  const [chargement, setChargement] = useState(true);
  const [matching, setMatching] = useState(false);
  const [majEnCours, setMajEnCours] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [lienCopie, setLienCopie] = useState(false);

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

  async function changerStatut(idResultat: string, statut: string) {
    setErreur(null);
    setSucces(null);
    setMajEnCours(idResultat);

    try {
      const maj = await apiFetch<Resultat>(`/api/v1/offres/resultats/${idResultat}/statut`, {
        method: "PATCH",
        body: JSON.stringify({ statut }),
      });
      setResultats((liste) =>
        liste.map((r) => (r.id_resultat === idResultat ? { ...r, ...maj } : r))
      );
      setSucces("Statut mis à jour, le candidat a été notifié");
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(typeof err.detail === "string" ? err.detail : "Impossible de changer le statut");
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setMajEnCours(null);
    }
  }

  async function copierLien() {
    if (!offre) return;
    const lien = `${window.location.origin}/postuler/${offre.lien_token}`;
    try {
      await navigator.clipboard.writeText(lien);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2500);
    } catch {
      setErreur("Impossible de copier le lien");
    }
  }

  const bgPage: React.CSSProperties = {
    background:
      "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.10), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.10), transparent 60%), #F7FAFD",
  };

  const panelStyle: React.CSSProperties = {
    border: "1px solid #DCE7F0",
    boxShadow: "0 8px 20px rgba(6,20,32,0.06)",
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

  if (!offre) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={bgPage}>
        <p className="text-sm font-semibold" style={{ color: "#B4232C" }}>
          Offre introuvable
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8" style={bgPage}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Link
            href="/offres"
            className="text-sm font-semibold"
            style={{ color: "#187ACD" }}
          >
            ← Retour aux offres
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6" style={panelStyle}>
          <h1 className="font-extrabold" style={{ fontSize: "20px", color: "#10202E" }}>
            {offre.titre_offre}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#587B95" }}>
            {offre.type_contrat || "—"}
          </p>
          {offre.resume_offre && (
            <p className="text-sm mt-3" style={{ color: "#10202E" }}>
              {offre.resume_offre}
            </p>
          )}
          <button
            type="button"
            onClick={copierLien}
            className="mt-4 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors"
            style={{ border: "1.5px solid #187ACD", color: "#187ACD", background: "#fff" }}
          >
            {lienCopie ? "Lien copié !" : "Copier le lien de candidature"}
          </button>
        </div>

        {offre.criteres.length > 0 && (
          <div className="bg-white rounded-2xl p-6" style={panelStyle}>
            <h2 className="text-sm font-extrabold mb-1" style={{ color: "#10202E" }}>
              Critères de sélection
            </h2>
            <p className="text-xs mb-4" style={{ color: "#94A9B8" }}>
              Utilisés pour calculer le score de correspondance des candidatures.
            </p>
            <div className="flex flex-wrap gap-2">
              {offre.criteres.map((critere) => {
                const style = NIVEAUX_STYLE[critere.niveau];
                return (
                  <span
                    key={critere.id_critere}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ background: style.background, color: style.color }}
                  >
                    {critere.libelle}
                    <span className="opacity-70">· {style.libelle}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6" style={panelStyle}>
          <h2 className="text-sm font-extrabold mb-4" style={{ color: "#10202E" }}>
            Évaluer un candidat par code CV
          </h2>
          <form onSubmit={handleMatching} className="flex gap-2">
            <input
              type="text"
              required
              value={codeCv}
              onChange={(e) => setCodeCv(e.target.value)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-mono outline-none transition-colors"
              style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
              placeholder="Code CV (ex: A1B2C3D4)"
            />
            <button
              type="submit"
              disabled={matching}
              className="text-white rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)" }}
            >
              {matching ? "..." : "Évaluer"}
            </button>
          </form>

          {erreur && (
            <p
              className="text-sm rounded-lg px-3 py-2 mt-3"
              style={{ color: "#B4232C", background: "#FDEDEE", border: "1px solid #F6C6C9" }}
            >
              {erreur}
            </p>
          )}
          {succes && (
            <p
              className="text-sm rounded-lg px-3 py-2 mt-3"
              style={{ color: "#0F7A5C", background: "#E9F8F2", border: "1px solid #BEEBDA" }}
            >
              {succes}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6" style={panelStyle}>
          <h2 className="text-sm font-extrabold mb-4" style={{ color: "#10202E" }}>
            Candidats évalués ({resultats.length})
          </h2>

          {resultats.length === 0 ? (
            <p className="text-sm" style={{ color: "#587B95" }}>
              Aucun candidat évalué pour l&apos;instant.
            </p>
          ) : (
            <div className="space-y-2">
              {resultats.map((r) => (
                <div
                  key={r.id_resultat}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
                  style={{ border: "1px solid #DCE7F0" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#187ACD" }}>
                    Score : {r.score_sim.toFixed(1)}
                  </span>
                  <select
                    value={r.statut_candidature ?? "RECUE"}
                    disabled={majEnCours === r.id_resultat}
                    onChange={(e) => changerStatut(r.id_resultat, e.target.value)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none disabled:opacity-50"
                    style={{ border: "1.5px solid #DCE7F0", color: "#10202E", background: "#fff" }}
                  >
                    {STATUTS.map((s) => (
                      <option key={s.valeur} value={s.valeur}>
                        {s.libelle}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
