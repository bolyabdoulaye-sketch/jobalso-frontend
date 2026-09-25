"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch, ApiError } from "@/lib/api-client";

const bgStyle: React.CSSProperties = {
  background:
    "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
};

export default function MotDePasseOubliePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);

    try {
      const reponse = await apiFetch<{ message: string }>("/api/v1/auth/forgot-password", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email }),
      });
      setMessage(reponse.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(typeof err.detail === "string" ? err.detail : "Une erreur est survenue");
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={bgStyle}>
      <div
        className="bg-white rounded-2xl w-full p-9"
        style={{ maxWidth: "440px", boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)" }}
      >
        <button
          type="button"
          onClick={() => router.push("/connexion")}
          className="text-sm font-semibold mb-6 inline-block"
          style={{ color: "#187ACD" }}
        >
          ← Retour à la connexion
        </button>

        <div className="flex justify-center mb-5">
          <Image src="/logo.png" alt="Jobalso" width={170} height={36} className="h-9 w-auto" priority />
        </div>

        <h2
          className="text-center font-extrabold mb-2"
          style={{ color: "#10202E", fontSize: "22px", letterSpacing: "-0.01em" }}
        >
          Mot de passe oublié
        </h2>

        {message ? (
          <p className="text-sm text-center mt-4" style={{ color: "#587B95" }}>
            {message}
          </p>
        ) : (
          <>
            <p className="text-sm text-center mb-6" style={{ color: "#587B95" }}>
              Indiquez votre email : nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

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
                {envoi ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
