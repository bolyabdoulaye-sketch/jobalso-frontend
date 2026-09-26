"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrentUser } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.push(user.type_utilisateur === "RECRUTEUR" ? "/offres" : "/cv");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
        }}
      >
        <div className="text-white text-sm font-semibold">Chargement...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background:
          "radial-gradient(900px 500px at 15% 10%, rgba(245,128,37,0.18), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(24,122,205,0.25), transparent 60%), linear-gradient(135deg, #063F79, #0D5298 55%, #187ACD)",
      }}
    >
      <div
        className="bg-white rounded-2xl w-full p-9 animate-[loginIn_.35s_cubic-bezier(.2,.7,.3,1)]"
        style={{
          maxWidth: "720px",
          boxShadow: "0 24px 60px rgba(6,20,32,0.16), 0 8px 20px rgba(6,20,32,0.08)",
        }}
      >
        <div className="flex justify-center mb-[22px]">
          <Image
            src="/logo.png"
            alt="Jobalso"
            width={170}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </div>

        <h2
          className="text-center font-extrabold mb-[6px]"
          style={{ color: "#10202E", fontSize: "24px", letterSpacing: "-0.01em" }}
        >
          Bienvenue sur Jobalso
        </h2>
        <p
          className="text-center font-semibold mb-[26px]"
          style={{ color: "#587B95", fontSize: "13px" }}
        >
          Choisissez votre espace pour vous connecter
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/persona-recruteur")}
            className="text-center transition-all duration-150 rounded-xl p-[22px_18px] border-2 hover:-translate-y-0.5"
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
            <div className="text-[28px] mb-2">🧑‍💼</div>
            <h4 className="font-extrabold mb-1" style={{ fontSize: "15px", color: "#10202E" }}>
              Espace Recruteur
            </h4>
            <p className="font-medium" style={{ fontSize: "12px", color: "#587B95" }}>
              PME, entrepreneurs, RH, agences de recrutement
            </p>
          </button>

          <button
            onClick={() => router.push("/connexion?role=candidat")}
            className="text-center transition-all duration-150 rounded-xl p-[22px_18px] border-2 hover:-translate-y-0.5"
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
            <div className="text-[28px] mb-2">🎓</div>
            <h4 className="font-extrabold mb-1" style={{ fontSize: "15px", color: "#10202E" }}>
              Espace Candidat
            </h4>
            <p className="font-medium" style={{ fontSize: "12px", color: "#587B95" }}>
              Trouvez des opportunités qui correspondent à votre profil
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
