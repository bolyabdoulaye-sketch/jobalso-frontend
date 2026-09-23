"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { PERSONAS } from "@/lib/personas";

const bgStyle = {
  background:
    "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
};

export default function PersonaRecruteurPage() {
  const router = useRouter();

  function choosePersona(personaId: string) {
    router.push(`/connexion?role=recruteur&persona=${personaId}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={bgStyle}>
      <div
        className="bg-white rounded-2xl w-full p-9 animate-[loginIn_.35s_cubic-bezier(.2,.7,.3,1)]"
        style={{ maxWidth: "760px", boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)" }}
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
          className="text-center font-extrabold mb-[6px]"
          style={{ color: "#10202E", fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          Quel type de recruteur êtes-vous ?
        </h2>
        <p className="text-center font-semibold mb-8" style={{ color: "#587B95", fontSize: "13px" }}>
          Jobalso adapte les fonctionnalités mises en avant à votre réalité
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => choosePersona(p.id)}
              className="flex items-start gap-3 text-left transition-all duration-150 rounded-xl p-4 border-2 hover:-translate-y-0.5"
              style={{ borderColor: "#DCE7F0" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#187ACD";
                e.currentTarget.style.background = "#F7FAFD";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DCE7F0";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="text-[24px] leading-none mt-0.5">{p.icon}</div>
              <div>
                <h4 className="font-extrabold mb-1" style={{ fontSize: "14px", color: "#10202E" }}>
                  {p.label}
                </h4>
                <p className="font-medium" style={{ fontSize: "12px", color: "#587B95" }}>
                  {p.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
