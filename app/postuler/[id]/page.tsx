"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { apiFetch, ApiError } from "@/lib/api-client";

interface OffrePublique {
  id_offre: string;
  titre_offre: string;
  type_contrat: string | null;
  resume_offre: string | null;
}

const bgStyle: React.CSSProperties = {
  background:
    "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
};

const carteStyle: React.CSSProperties = {
  maxWidth: "640px",
  boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)",
};

const inputStyle: React.CSSProperties = { border: "1.5px solid #DCE7F0", color: "#10202E" };

function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "#187ACD";
}
function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "#DCE7F0";
}

function listeDepuisTexte(valeur: string): string[] {
  return valeur.split(",").map((v) => v.trim()).filter(Boolean);
}

export default function PostulerPage() {
  const params = useParams();
  const offreId = params.id as string;

  const [offre, setOffre] = useState<OffrePublique | null>(null);
  const [chargement, setChargement] = useState(true);
  const [indisponible, setIndisponible] = useState(false);

  const [nomPrenom, setNomPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [resume, setResume] = useState("");
  const [competences, setCompetences] = useState("");
  const [langues, setLangues] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [siteWeb, setSiteWeb] = useState(""); // champ piege anti-spam

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<OffrePublique>(`/api/v1/public/offres/${offreId}`, { auth: false })
      .then(setOffre)
      .catch(() => setIndisponible(true))
      .finally(() => setChargement(false));
  }, [offreId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);

    try {
      const reponse = await apiFetch<{ message: string }>(
        `/api/v1/public/offres/${offreId}/postuler`,
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({
            nom_prenom: nomPrenom,
            email,
            numero_telephone: telephone,
            resume_cv: resume || null,
            competences: listeDepuisTexte(competences),
            langues: listeDepuisTexte(langues),
            consentement_accepte: consentement,
            site_web: siteWeb,
          }),
        }
      );
      setMessage(reponse.message);
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = Array.isArray(err.detail)
          ? err.detail.map((d: { msg: string }) => d.msg).join(", ")
          : typeof err.detail === "string"
          ? err.detail
          : "Envoi impossible";
        setErreur(msg);
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
        <p className="text-white text-sm font-semibold">Chargement...</p>
      </div>
    );
  }

  if (indisponible || !offre) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8" style={bgStyle}>
        <div className="bg-white rounded-2xl w-full p-8 text-center" style={carteStyle}>
          <p className="font-extrabold" style={{ fontSize: "18px", color: "#10202E" }}>
            Cette offre n&apos;est plus disponible
          </p>
          <p className="text-sm mt-2" style={{ color: "#587B95" }}>
            Elle a peut-être été fermée ou le lien est incorrect.
          </p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8" style={bgStyle}>
        <div className="bg-white rounded-2xl w-full p-8 text-center" style={carteStyle}>
          <p className="font-extrabold" style={{ fontSize: "20px", color: "#0F7A5C" }}>
            Candidature envoyée !
          </p>
          <p className="text-sm mt-3" style={{ color: "#587B95" }}>
            {message}
          </p>
          <p className="text-sm mt-1" style={{ color: "#587B95" }}>
            Poste : <strong style={{ color: "#10202E" }}>{offre.titre_offre}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-8" style={bgStyle}>
      <div className="bg-white rounded-2xl w-full p-6 sm:p-9" style={carteStyle}>
        <div className="flex justify-center mb-5">
          <Image src="/logo.png" alt="Jobalso" width={170} height={36} className="h-9 w-auto" priority />
        </div>

        <h1 className="text-center font-extrabold" style={{ fontSize: "22px", color: "#10202E" }}>
          {offre.titre_offre}
        </h1>
        <p className="text-center text-sm mt-1" style={{ color: "#587B95" }}>
          {offre.type_contrat || "Type de contrat non précisé"}
        </p>
        {offre.resume_offre && (
          <p className="text-sm mt-4" style={{ color: "#10202E" }}>
            {offre.resume_offre}
          </p>
        )}

        <div className="my-6" style={{ borderTop: "1px solid #EDF3F8" }} />

        <h2 className="font-extrabold mb-4" style={{ fontSize: "15px", color: "#10202E" }}>
          Postuler à cette offre
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
              Nom complet
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={nomPrenom}
              onChange={(e) => setNomPrenom(e.target.value)}
              className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
                Téléphone
              </label>
              <input
                type="tel"
                required
                minLength={6}
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+221 77 123 45 67"
                className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
              Résumé de votre profil
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={4}
              maxLength={5000}
              className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors resize-none"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Décrivez votre parcours en quelques lignes"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
                Compétences{" "}
                <span className="font-normal" style={{ color: "#94A9B8" }}>
                  (séparées par des virgules)
                </span>
              </label>
              <input
                type="text"
                value={competences}
                onChange={(e) => setCompetences(e.target.value)}
                placeholder="Python, FastAPI"
                className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
                Langues{" "}
                <span className="font-normal" style={{ color: "#94A9B8" }}>
                  (séparées par des virgules)
                </span>
              </label>
              <input
                type="text"
                value={langues}
                onChange={(e) => setLangues(e.target.value)}
                placeholder="Français, Anglais"
                className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Champ piege anti-spam : invisible pour les humains */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
            <label>
              Ne pas remplir
              <input
                type="text"
                name="site_web"
                tabIndex={-1}
                autoComplete="off"
                value={siteWeb}
                onChange={(e) => setSiteWeb(e.target.value)}
              />
            </label>
          </div>

          {erreur && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erreur}
            </p>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentement}
              onChange={(e) => setConsentement(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
              style={{ accentColor: "#187ACD" }}
            />
            <span className="text-sm" style={{ color: "#587B95" }}>
              J&apos;accepte la{" "}
              <a
                href="/politique-confidentialite"
                target="_blank"
                className="font-bold underline"
                style={{ color: "#187ACD" }}
              >
                politique de confidentialité
              </a>{" "}
              de Jobalso et le traitement de mes données personnelles.
            </span>
          </label>

          <button
            type="submit"
            disabled={envoi || !consentement}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-50"
            style={{ background: "#187ACD" }}
          >
            {envoi ? "Envoi..." : "Envoyer ma candidature"}
          </button>
        </form>
      </div>
    </div>
  );
}
