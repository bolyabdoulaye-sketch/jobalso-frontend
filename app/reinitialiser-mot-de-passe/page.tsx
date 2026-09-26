"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { apiFetch, ApiError } from "@/lib/api-client";

const bgStyle: React.CSSProperties = {
  background:
    "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
};

const carteStyle: React.CSSProperties = {
  maxWidth: "440px",
  boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)",
};

function ReinitialiserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);

    if (motDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas");
      return;
    }

    setEnvoi(true);
    try {
      await apiFetch("/api/v1/auth/reset-password", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ token, nouveau_mot_de_passe: motDePasse }),
      });
      setSucces(true);
      setTimeout(() => router.push("/connexion"), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(typeof err.detail === "string" ? err.detail : "Lien invalide ou expiré");
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setEnvoi(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={bgStyle}>
        <div className="bg-white rounded-2xl w-full p-9 text-center" style={carteStyle}>
          <p className="font-extrabold" style={{ color: "#B4232C", fontSize: "18px" }}>
            Lien invalide
          </p>
          <p className="text-sm mt-2" style={{ color: "#587B95" }}>
            Ce lien de réinitialisation est incomplet. Demandez-en un nouveau.
          </p>
        </div>
      </div>
    );
  }

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={bgStyle}>
        <div className="bg-white rounded-2xl w-full p-9 text-center" style={carteStyle}>
          <p className="font-extrabold" style={{ color: "#187ACD", fontSize: "18px" }}>
            Mot de passe réinitialisé !
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
      <div className="bg-white rounded-2xl w-full p-9" style={carteStyle}>
        <div className="flex justify-center mb-5">
          <Image src="/logo.png" alt="Jobalso" width={170} height={36} className="h-9 w-auto" priority />
        </div>

        <h2
          className="text-center font-extrabold mb-8"
          style={{ color: "#10202E", fontSize: "22px", letterSpacing: "-0.01em" }}
        >
          Nouveau mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
              style={{ border: "1.5px solid #DCE7F0" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
            />
          </div>

          <div>
            <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-3.5 py-3 text-sm outline-none transition-colors"
              style={{ border: "1.5px solid #DCE7F0" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
            />
          </div>

          {erreur && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={envoi}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-50"
            style={{ background: "#187ACD" }}
          >
            {envoi ? "Enregistrement..." : "Réinitialiser mon mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ReinitialiserMotDePassePage() {
  return (
    <Suspense fallback={null}>
      <ReinitialiserContent />
    </Suspense>
  );
}
