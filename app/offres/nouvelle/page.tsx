"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      const offre = await apiFetch<Offre>("/api/v1/offres/", { method: "POST", body: JSON.stringify(payload) });
      router.push(`/offres/${offre.id_offre}`);
    } catch (err) {
      setErreur(err instanceof ApiError && typeof err.detail === "string" ? err.detail : "Erreur lors de la création");
    } finally {
      setChargement(false);
    }
  }

  const bgPage: React.CSSProperties = {
    background:
      "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.10), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.10), transparent 60%), #F7FAFD",
  };

  const inputStyle: React.CSSProperties = { border: "1.5px solid #DCE7F0", color: "#10202E" };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "#187ACD");
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "#DCE7F0");

  return (
    <div className="min-h-screen" style={bgPage}>
      <header className="bg-white" style={{ borderBottom: "1px solid #DCE7F0" }}>
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="font-extrabold" style={{ fontSize: "18px", color: "#10202E" }}>
            Jobalso
          </p>
          <Link
            href="/offres"
            className="text-sm font-semibold transition-colors"
            style={{ color: "#187ACD" }}
          >
            ← Retour aux offres
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-extrabold mb-6" style={{ fontSize: "24px", color: "#10202E" }}>
          Nouvelle offre
        </h1>

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
              Titre du poste
            </label>
            <input
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Développeur Backend Python"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
                Type de contrat
              </label>
              <input
                value={typeContrat}
                onChange={(e) => setTypeContrat(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="CDI"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
                Revenu proposé
              </label>
              <input
                type="number"
                value={revenu}
                onChange={(e) => setRevenu(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="45000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Résumé
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={4}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors resize-none"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Décrivez le poste"
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

          <button
            type="submit"
            disabled={chargement}
            className="w-full text-white rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)" }}
          >
            {chargement ? "Publication..." : "Publier l'offre"}
          </button>
        </form>
      </main>
    </div>
  );
}
