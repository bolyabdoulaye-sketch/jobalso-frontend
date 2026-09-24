"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { apiLogin, ApiError, setToken } from "@/lib/api-client";
import { getPersonaById } from "@/lib/personas";

const bgStyle = {
  background:
    "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
};

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const persona = searchParams.get("persona");
  const personaInfo = getPersonaById(persona);

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const titre =
    role === "recruteur"
      ? "Connexion recruteur"
      : role === "candidat"
      ? "Connexion candidat"
      : "Connexion";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      const { access_token } = await apiLogin(email, motDePasse);
      setToken(access_token);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(typeof err.detail === "string" ? err.detail : "Connexion impossible");
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={bgStyle}>
      <div
        className="bg-white rounded-2xl w-full p-9 animate-[loginIn_.35s_cubic-bezier(.2,.7,.3,1)]"
        style={{
          maxWidth: "480px",
          boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)",
        }}
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

        {personaInfo && (
          <div className="flex justify-center mb-4">
            <div
              className="inline-flex items-center gap-2 rounded-full font-bold"
              style={{ background: "#D0EFFF", color: "#0D5298", fontSize: "13px", padding: "8px 16px" }}
            >
              <span>{personaInfo.icon}</span>
              <span>{personaInfo.label}</span>
            </div>
          </div>
        )}

        <h2
          className="text-center font-extrabold mb-8"
          style={{ color: "#10202E", fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          {titre}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              style={{ border: "1.5px solid #DCE7F0" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
            />
          </div>

          <div>
            <label className="block font-bold mb-1.5" style={{ color: "#10202E", fontSize: "13px" }}>
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
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
            disabled={chargement}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-50"
            style={{ background: "#187ACD" }}
            onMouseEnter={(e) => {
              if (!chargement) e.currentTarget.style.background = "#0D5298";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#187ACD";
            }}
          >
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "#587B95" }}>
          Pas encore de compte ?{" "}
          <a
            href={
              role
                ? `/inscription?role=${role}${persona ? `&persona=${persona}` : ""}`
                : "/inscription"
            }
            className="font-bold"
            style={{ color: "#187ACD" }}
          >
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionContent />
    </Suspense>
  );
}
