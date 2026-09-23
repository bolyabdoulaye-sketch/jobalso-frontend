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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.10), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.10), transparent 60%), #F7FAFD",
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "#587B95" }}>
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background:
          "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.10), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.10), transparent 60%), #F7FAFD",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-extrabold" style={{ fontSize: "22px", color: "#10202E" }}>
              Mon CV
            </h1>
            <p className="text-sm font-semibold" style={{ color: "#587B95" }}>
              Espace talent
            </p>
          </div>
          <button
            onClick={() => logout("CANDIDAT")}
            className="text-sm font-semibold transition-colors"
            style={{ color: "#587B95" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#10202E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#587B95")}
          >
            Déconnexion
          </button>
        </div>

        {cv && (
          <div
            className="bg-white rounded-2xl p-5 mb-6"
            style={{
              border: "1px solid #DCE7F0",
              boxShadow: "0 8px 20px rgba(6,20,32,0.06)",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#587B95" }}>
              Code CV à partager aux recruteurs
            </p>
            <p className="text-2xl font-mono font-extrabold mt-1" style={{ color: "#187ACD" }}>
              {cv.code_cv}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 space-y-4"
          style={{
            border: "1px solid #DCE7F0",
            boxShadow: "0 24px 60px rgba(6,20,32,0.10), 0 8px 20px rgba(6,20,32,0.06)",
          }}
        >
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Résumé
            </label>
            <textarea
              value={resumeCv}
              onChange={(e) => setResumeCv(e.target.value)}
              rows={4}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors resize-none"
              style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
              placeholder="Décrivez votre profil en quelques lignes"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Compétences{" "}
              <span className="font-normal" style={{ color: "#94A9B8" }}>
                (séparées par des virgules)
              </span>
            </label>
            <input
              type="text"
              value={competences}
              onChange={(e) => setCompetences(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
              placeholder="Python, FastAPI, PostgreSQL"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Langues{" "}
              <span className="font-normal" style={{ color: "#94A9B8" }}>
                (séparées par des virgules)
              </span>
            </label>
            <input
              type="text"
              value={langues}
              onChange={(e) => setLangues(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
              placeholder="Français, Anglais"
            />
          </div>

          {erreur && (
            <p
              className="text-sm rounded-lg px-3 py-2"
              style={{ color: "#B4232C", background: "#FDEDEE", border: "1px solid #F6C6C9" }}
            >
              {erreur}
            </p>
          )}
          {succes && (
            <p
              className="text-sm rounded-lg px-3 py-2"
              style={{ color: "#0F7A5C", background: "#E9F8F2", border: "1px solid #BEEBDA" }}
            >
              CV enregistré avec succès
            </p>
          )}

          <button
            type="submit"
            disabled={enregistrement}
            className="w-full text-white rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)" }}
          >
            {enregistrement ? "Enregistrement..." : cv ? "Mettre à jour" : "Créer mon CV"}
          </button>
        </form>
      </div>
    </div>
  );
}
