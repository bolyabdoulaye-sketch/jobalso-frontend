"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { InscriptionPayload, TypeUtilisateur } from "@/types";

const bgStyle = {
  background:
    "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
};

const inputStyle: React.CSSProperties = { border: "1.5px solid #DCE7F0" };

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#187ACD";
}
function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#DCE7F0";
}

export default function InscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeUtilisateur, setTypeUtilisateur] = useState<TypeUtilisateur>("CANDIDAT");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nomPrenom, setNomPrenom] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [paysEntreprise, setPaysEntreprise] = useState("");
  const [localisationEntreprise, setLocalisationEntreprise] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "recruteur") setTypeUtilisateur("RECRUTEUR");
    if (role === "candidat") setTypeUtilisateur("CANDIDAT");
  }, [searchParams]);

  const roleVerrouille = searchParams.get("role") === "recruteur" || searchParams.get("role") === "candidat";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    const payload: InscriptionPayload = {
      email,
      numero_telephone: telephone,
      mot_de_passe: motDePasse,
      nom_prenom: nomPrenom,
      type_utilisateur: typeUtilisateur,
    };

    if (typeUtilisateur === "RECRUTEUR") {
      payload.entreprise = {
        nom_entreprise: nomEntreprise,
        pays: paysEntreprise,
        localisation_entreprise: localisationEntreprise || undefined,
      };
    }

    try {
      await apiFetch("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: false,
      });
      setSucces(true);
      setTimeout(() => router.push("/connexion"), 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = Array.isArray(err.detail)
          ? err.detail.map((d: { msg: string }) => d.msg).join(", ")
          : typeof err.detail === "string"
          ? err.detail
          : "Inscription impossible";
        setErreur(msg);
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setChargement(false);
    }
  }

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={bgStyle}>
        <div
          className="bg-white rounded-2xl w-full p-9 text-center animate-[loginIn_.35s_cubic-bezier(.2,.7,.3,1)]"
          style={{ maxWidth: "480px", boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)" }}
        >
          <p className="font-bold" style={{ color: "#187ACD", fontSize: "18px" }}>
            Compte créé avec succès !
          </p>
          <p className="text-sm mt-2" style={{ color: "#587B95" }}>
            Redirection vers la connexion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={bgStyle}>
      <div
        className="bg-white rounded-2xl w-full p-9 animate-[loginIn_.35s_cubic-bezier(.2,.7,.3,1)]"
        style={{ maxWidth: "560px", boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)" }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm font-semibold mb-6 inline-block"
          style={{ color: "#187ACD" }}
        >
          ← Retour
        </button>

        <div className="flex justify-center mb-5">
          <Image src="/logo.png" alt="Jobalso" width={170} height={36} className="h-9 w-auto" priority />
        </div>

        <h2
          className="text-center font-extrabold mb-8"
          style={{ color: "#10202E", fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          Créer un compte
        </h2>

        {roleVerrouille ? (
          <div
            className="text-center rounded-lg py-2.5 text-sm font-bold mb-6"
            style={{ background: "#F7FAFD", color: "#187ACD", border: "1.5px solid #DCE7F0" }}
          >
            {typeUtilisateur === "RECRUTEUR" ? "Espace Recruteur" : "Espace Candidat"}
          </div>
        ) : (
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setTypeUtilisateur("CANDIDAT")}
              className="flex-1 rounded-lg py-2.5 text-sm font-bold transition-colors"
              style={
                typeUtilisateur === "CANDIDAT"
                  ? { background: "#187ACD", color: "#fff" }
                  : { background: "#F7FAFD", color: "#587B95", border: "1.5px solid #DCE7F0" }
              }
            >
              Candidat
            </button>
            <button
              type="button"
              onClick={() => setTypeUtilisateur("RECRUTEUR")}
              className="flex-1 rounded-lg py-2.5 text-sm font-bold transition-colors"
              style={
                typeUtilisateur === "RECRUTEUR"
                  ? { background: "#187ACD", color: "#fff" }
                  : { background: "#F7FAFD", color: "#587B95", border: "1.5px solid #DCE7F0" }
              }
            >
              Recruteur
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
              Nom complet
            </label>
            <input
              type="text"
              required
              value={nomPrenom}
              onChange={(e) => setNomPrenom(e.target.value)}
              className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

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
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+221 77 123 45 67"
              className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {typeUtilisateur === "RECRUTEUR" && (
            <div className="space-y-4 pt-4" style={{ borderTop: "1px solid #EDF3F8" }}>
              <p className="font-bold" style={{ color: "#10202E", fontSize: "13px" }}>
                Informations entreprise
              </p>

              <div>
                <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  required
                  value={nomEntreprise}
                  onChange={(e) => setNomEntreprise(e.target.value)}
                  className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
                  Pays
                </label>
                <input
                  type="text"
                  required
                  value={paysEntreprise}
                  onChange={(e) => setPaysEntreprise(e.target.value)}
                  className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
                  Localisation (optionnel)
                </label>
                <input
                  type="text"
                  value={localisationEntreprise}
                  onChange={(e) => setLocalisationEntreprise(e.target.value)}
                  className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          )}

          {erreur && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={chargement}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-50 mt-2"
            style={{ background: "#187ACD" }}
            onMouseEnter={(e) => {
              if (!chargement) e.currentTarget.style.background = "#0D5298";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#187ACD";
            }}
          >
            {chargement ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "#587B95" }}>
          Déjà un compte ?{" "}
          <a href="/connexion" className="font-bold" style={{ color: "#187ACD" }}>
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
