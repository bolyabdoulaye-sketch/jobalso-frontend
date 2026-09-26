"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, API_URL, getToken } from "@/lib/api-client";
import { logout } from "@/lib/auth";
import type { CV, CVPayload } from "@/types";

function uploaderCv(
  fichier: File,
  onProgress: (pct: number) => void
): Promise<CV> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_URL}/api/v1/cv/upload`);

    const token = getToken();

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Réponse invalide du serveur"));
        }
      } else {
        let detail = "Échec de l'upload";

        try {
          const body = JSON.parse(xhr.responseText);
          detail = body.detail || detail;
        } catch {
          // message par défaut
        }

        reject(new Error(detail));
      }
    };

    xhr.onerror = () =>
      reject(new Error("Erreur de connexion au serveur"));

    const formData = new FormData();
    formData.append("fichier", fichier);

    xhr.send(formData);
  });
}

/* =========================================================
   ICÔNES
========================================================= */

function Icon({
  children,
  size = 20,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

function UserIcon() {
  return (
    <Icon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.2-6 8-6s6.5 2 8 6" />
      </svg>
    </Icon>
  );
}

/* CORRECTION : FileIcon accepte maintenant size */
function FileIcon({ size = 20 }: { size?: number }) {
  return (
    <Icon size={size}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </svg>
    </Icon>
  );
}

function BriefcaseIcon() {
  return (
    <Icon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    </Icon>
  );
}

function BellIcon() {
  return (
    <Icon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    </Icon>
  );
}

function ClipboardIcon() {
  return (
    <Icon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V2h6v2" />
        <path d="M9 10h6" />
        <path d="M9 14h6" />
      </svg>
    </Icon>
  );
}

function MessageIcon() {
  return (
    <Icon>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.9L3 21l1.7-4.1A8.4 8.4 0 0 1 3 12a8.5 8.5 0 0 1 9-8.5 8.5 8.5 0 0 1 9 8z" />
      </svg>
    </Icon>
  );
}

function LogoutIcon() {
  return (
    <Icon>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
    </Icon>
  );
}

/* =========================================================
   ETIQUETTES
========================================================= */

function Etiquettes({
  valeurs,
  onChange,
  placeholder,
}: {
  valeurs: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [saisie, setSaisie] = useState("");

  function ajouter() {
    const valeur = saisie.trim();

    if (valeur && !valeurs.includes(valeur)) {
      onChange([...valeurs, valeur]);
    }

    setSaisie("");
  }

  function retirer(valeur: string) {
    onChange(valeurs.filter((x) => x !== valeur));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {valeurs.map((valeur) => (
          <span
            key={valeur}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              background: "#D8F0FF",
              color: "#075A9E",
            }}
          >
            {valeur}

            <button
              type="button"
              onClick={() => retirer(valeur)}
              className="font-bold opacity-70 hover:opacity-100"
              aria-label={`Retirer ${valeur}`}
            >
              ×
            </button>
          </span>
        ))}

        {valeurs.length === 0 && (
          <span
            className="text-xs"
            style={{ color: "#94A9B8" }}
          >
            Rien détecté pour l'instant
          </span>
        )}
      </div>

      <input
        type="text"
        value={saisie}
        onChange={(e) => setSaisie(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            ajouter();
          }
        }}
        onBlur={(e) => {
          ajouter();
          e.currentTarget.style.borderColor = "#D6E3ED";
          e.currentTarget.style.boxShadow = "none";
        }}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
        style={{
          border: "1px solid #D6E3ED",
          color: "#10202E",
          background: "#FFFFFF",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#1682D4";
          e.currentTarget.style.boxShadow =
            "0 0 0 3px rgba(22,130,212,0.10)";
        }}
      />
    </div>
  );
}

/* =========================================================
   CHAMP
========================================================= */

function Champ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="block text-xs font-bold mb-2"
        style={{ color: "#123B60" }}
      >
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
        style={{
          border: "1px solid #D6E3ED",
          color: "#10202E",
          background: "#FFFFFF",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#1682D4";
          e.currentTarget.style.boxShadow =
            "0 0 0 3px rgba(22,130,212,0.10)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#D6E3ED";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function CVPage() {
  const [cv, setCv] = useState<CV | null>(null);

  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);

  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  const [resumeCv, setResumeCv] = useState("");
  const [competences, setCompetences] = useState<string[]>([]);
  const [langues, setLangues] = useState<string[]>([]);
  const [localisation, setLocalisation] = useState("");
  const [typePosteRecherche, setTypePosteRecherche] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [domaineEtude, setDomaineEtude] = useState("");
  const [certifications, setCertifications] = useState("");

  const [glisser, setGlisser] = useState(false);
  const [uploadEnCours, setUploadEnCours] = useState(false);
  const [progression, setProgression] = useState(0);
  const [erreurUpload, setErreurUpload] = useState<string | null>(null);

  const inputFichierRef = useRef<HTMLInputElement>(null);

  function appliquerCv(data: CV) {
    setCv(data);

    setResumeCv(data.resume_cv || "");

    setCompetences(
      Array.isArray(data.competences)
        ? (data.competences as string[])
        : []
    );

    setLangues(
      Array.isArray(data.langues)
        ? (data.langues as string[])
        : []
    );

    setLocalisation(data.localisation || "");
    setTypePosteRecherche(data.type_poste_recherche || "");

    setExperience(
      Array.isArray(data.experience)
        ? (data.experience as string[]).join(", ")
        : ""
    );

    setEducation(
      Array.isArray(data.education)
        ? (data.education as string[]).join(", ")
        : ""
    );

    setDomaineEtude(
      Array.isArray(data.domaine_etude)
        ? (data.domaine_etude as string[]).join(", ")
        : ""
    );

    setCertifications(
      Array.isArray(data.certifications)
        ? (data.certifications as string[]).join(", ")
        : ""
    );
  }

  useEffect(() => {
    apiFetch<CV>("/api/v1/cv/moi")
      .then(appliquerCv)
      .catch((err) => {
        if (err instanceof ApiError && err.status !== 404) {
          setErreur("Impossible de charger le CV");
        }
      })
      .finally(() => setChargement(false));
  }, []);

  function toListe(valeur: string): string[] {
    return valeur
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  async function traiterFichier(fichier: File) {
    setErreurUpload(null);

    const extension = fichier.name
      .toLowerCase()
      .slice(fichier.name.lastIndexOf("."));

    if (![".pdf", ".docx"].includes(extension)) {
      setErreurUpload(
        "Seuls les fichiers PDF et DOCX sont acceptés"
      );
      return;
    }

    if (fichier.size > 10 * 1024 * 1024) {
      setErreurUpload(
        "Le fichier dépasse la taille maximale de 10 Mo"
      );
      return;
    }

    setUploadEnCours(true);
    setProgression(0);

    try {
      const resultat = await uploaderCv(
        fichier,
        setProgression
      );

      appliquerCv(resultat);
      setSucces(true);
    } catch (err) {
      setErreurUpload(
        err instanceof Error
          ? err.message
          : "Échec de l'upload"
      );
    } finally {
      setUploadEnCours(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();

    setGlisser(false);

    const fichier = e.dataTransfer.files?.[0];

    if (fichier) {
      traiterFichier(fichier);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErreur(null);
    setSucces(false);
    setEnregistrement(true);

    const payload: CVPayload = {
      resume_cv: resumeCv,
      competences,
      langues,
      localisation: localisation || undefined,
      type_poste_recherche:
        typePosteRecherche || undefined,
      experience: toListe(experience),
      education: toListe(education),
      domaine_etude: toListe(domaineEtude),
      certifications: toListe(certifications),
    };

    try {
      const method = cv ? "PUT" : "POST";

      const path = cv
        ? "/api/v1/cv/moi"
        : "/api/v1/cv/";

      const result = await apiFetch<CV>(path, {
        method,
        body: JSON.stringify(payload),
      });

      setCv(result);
      setSucces(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(
          typeof err.detail === "string"
            ? err.detail
            : "Erreur lors de l'enregistrement"
        );
      } else {
        setErreur("Erreur de connexion au serveur");
      }
    } finally {
      setEnregistrement(false);
    }
  }

  /* =========================================================
     CHARGEMENT
  ========================================================= */

  if (chargement) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F4F8FC" }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-4 mx-auto mb-4 animate-spin"
            style={{
              borderColor: "#D9EAF7",
              borderTopColor: "#1679C9",
            }}
          />

          <p
            className="text-sm font-semibold"
            style={{ color: "#587B95" }}
          >
            Chargement de votre CV...
          </p>
        </div>
      </div>
    );
  }

  const tauxCompletude = cv?.taux_completude ?? 0;

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#F4F8FC",
        color: "#10202E",
      }}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className="hidden lg:flex w-[270px] min-h-screen flex-col shrink-0 fixed left-0 top-0 bottom-0"
        style={{
          background:
            "linear-gradient(180deg, #08477F 0%, #063F78 65%, #06376B 100%)",
        }}
      >
        {/* Logo */}

        <div className="px-5 pt-7">
          <div
            className="h-[78px] rounded-xl flex items-center px-5 bg-white"
            style={{
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            }}
          >
            <div className="relative mr-3">
              <div
                className="w-9 h-9 rotate-45 rounded-md"
                style={{
                  background:
                    "linear-gradient(135deg,#F6A623 50%,#1C83CF 50%)",
                }}
              />

              <div
                className="absolute w-4 h-4 bg-white rounded-full"
                style={{
                  top: "10px",
                  left: "10px",
                }}
              />
            </div>

            <span
              className="text-xl font-black tracking-tight"
              style={{ color: "#0875C9" }}
            >
              JOBALSO
            </span>
          </div>
        </div>

        {/* Profil candidat */}

        <div className="px-5 mt-6">
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.10)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{
                background: "#167BC7",
              }}
            >
              C
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">
                Candidat
              </p>

              <p className="text-blue-100 text-xs">
                Candidat
              </p>
            </div>

            <button
              type="button"
              onClick={() => logout("CANDIDAT")}
              className="text-xs font-bold text-white rounded-lg px-3 py-2 transition-all hover:bg-white/20"
              style={{
                background: "rgba(255,255,255,0.12)",
              }}
            >
              Quitter
            </button>
          </div>
        </div>

        {/* Navigation */}

        <nav className="px-5 mt-7">
          <p
            className="px-3 mb-3 text-xs font-bold tracking-wider"
            style={{ color: "#79B6E3" }}
          >
            MON PROFIL
          </p>

          <Link
            href="/cv"
            className="group flex items-center gap-3 px-3 py-3 rounded-lg mb-1 text-sm font-bold"
            style={{
              background: "#167BC7",
              color: "#FFFFFF",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF922C" }}
            />
            <FileIcon />
            <span>Mon CV</span>
          </Link>

          <Link
            href="/cv"
            className="group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF922C" }}
            />
            <UserIcon />
            <span>Profil intelligent</span>
          </Link>

          <Link
            href="/cv"
            className="group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF922C" }}
            />
            <FileIcon />
            <span>Déposer mon CV</span>
          </Link>

          <p
            className="px-3 mt-7 mb-3 text-xs font-bold tracking-wider"
            style={{ color: "#79B6E3" }}
          >
            OPPORTUNITÉS
          </p>

          <Link
            href="/offres"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF922C" }}
            />
            <BriefcaseIcon />
            <span>Mes recommandations</span>
          </Link>

          <Link
            href="/offres"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF922C" }}
            />
            <BellIcon />
            <span>Alertes</span>
          </Link>

          <Link
            href="/candidatures"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF922C" }}
            />
            <ClipboardIcon />
            <span>Suivi des candidatures</span>
          </Link>

          <Link
            href="/postule"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF922C" }}
            />
            <MessageIcon />
            <span>Simulation d'entretien</span>
          </Link>
        </nav>

        {/* Bas sidebar */}

        <div className="mt-auto px-5 pb-7">
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              background: "rgba(255,255,255,0.90)",
            }}
          >
            <p
              className="text-[10px] font-bold tracking-wider"
              style={{ color: "#587B95" }}
            >
              POWERED BY
            </p>

            <p
              className="font-black text-lg mt-1"
              style={{ color: "#263F52" }}
            >
              JuzAI
            </p>

            <p
              className="text-[10px]"
              style={{ color: "#587B95" }}
            >
              L&apos;IA au service du recrutement
            </p>
          </div>

          <p
            className="text-xs leading-5 mb-4"
            style={{ color: "#77A9D0" }}
          >
            Jobalso MVP · V1
            <br />
            Le copilote intelligent du recrutement
          </p>

          <button
            type="button"
            onClick={() => logout("CANDIDAT")}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            style={{
              border: "1px solid rgba(255,255,255,0.30)",
            }}
          >
            <LogoutIcon />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* =====================================================
          CONTENU
      ===================================================== */}

      <main className="w-full lg:ml-[270px] min-h-screen">
        {/* Header */}

        <header
          className="h-[82px] bg-white border-b flex items-center justify-between px-6 md:px-10"
          style={{
            borderColor: "#E2EBF2",
          }}
        >
          <div>
            <h1
              className="font-black text-xl md:text-2xl"
              style={{ color: "#10202E" }}
            >
              Mon CV
            </h1>

            <p
              className="text-xs md:text-sm"
              style={{ color: "#587B95" }}
            >
              Gérez votre profil professionnel et votre CV
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline-flex px-5 py-2 rounded-full text-xs font-bold"
              style={{
                background: "#D8F0FF",
                color: "#075A9E",
              }}
            >
              Candidat
            </span>

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                background:
                  "linear-gradient(135deg,#1478C8,#07538F)",
              }}
            >
              C
            </div>
          </div>
        </header>

        {/* Zone principale */}

        <div className="px-4 sm:px-6 md:px-10 py-7 max-w-[1250px] mx-auto">
          {/* =================================================
              CARTES DU HAUT
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Code CV */}

            <div
              className="bg-white rounded-2xl p-5"
              style={{
                border: "1px solid #DDE8F0",
                boxShadow: "0 6px 18px rgba(6,20,32,0.05)",
              }}
            >
              <p
                className="text-xs font-bold mb-1"
                style={{ color: "#123B60" }}
              >
                Code CV à partager aux recruteurs
              </p>

              <p
                className="text-2xl font-black tracking-wide"
                style={{ color: "#167BC7" }}
              >
                {cv?.code_cv || "—"}
              </p>
            </div>

            {/* Complétude */}

            <div
              className="bg-white rounded-2xl p-5"
              style={{
                border: "1px solid #DDE8F0",
                boxShadow: "0 6px 18px rgba(6,20,32,0.05)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-bold"
                  style={{ color: "#123B60" }}
                >
                  Complétude du profil
                </p>

                <span
                  className="text-xl font-black"
                  style={{ color: "#10202E" }}
                >
                  {tauxCompletude}%
                </span>
              </div>

              <div
                className="h-2 rounded-full overflow-hidden"
                style={{
                  background: "#E8F0F5",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${tauxCompletude}%`,
                    background:
                      "linear-gradient(90deg,#1478C8,#188EDB)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              UPLOAD
          ================================================= */}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setGlisser(true);
            }}
            onDragLeave={() => setGlisser(false)}
            onDrop={handleDrop}
            onClick={() => inputFichierRef.current?.click()}
            className="bg-white rounded-2xl p-8 md:p-10 mb-5 text-center cursor-pointer transition-all"
            style={{
              border: `1.5px dashed ${
                glisser ? "#1682D4" : "#CFE0EC"
              }`,
              background: glisser ? "#F3FAFF" : "#FFFFFF",
            }}
          >
            <input
              ref={inputFichierRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const fichier = e.target.files?.[0];

                if (fichier) {
                  traiterFichier(fichier);
                }

                e.target.value = "";
              }}
            />

            {uploadEnCours ? (
              <div className="max-w-md mx-auto">
                <div
                  className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "#E3F3FF",
                    color: "#167BC7",
                  }}
                >
                  <FileIcon size={24} />
                </div>

                <p
                  className="text-sm font-bold mb-3"
                  style={{ color: "#10202E" }}
                >
                  Analyse du CV en cours...
                </p>

                <div
                  className="w-full h-2 rounded-full"
                  style={{
                    background: "#E7EFF4",
                  }}
                >
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${progression}%`,
                      background: "#167BC7",
                    }}
                  />
                </div>

                <p
                  className="text-xs mt-2"
                  style={{ color: "#587B95" }}
                >
                  {progression}%
                </p>
              </div>
            ) : (
              <>
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{
                    background: "#F0F8FD",
                    color: "#167BC7",
                  }}
                >
                  <FileIcon size={26} />
                </div>

                <p
                  className="text-sm font-bold"
                  style={{ color: "#10202E" }}
                >
                  Glissez votre CV ici ou cliquez pour parcourir
                </p>

                <p
                  className="text-xs mt-2"
                  style={{ color: "#94A9B8" }}
                >
                  PDF ou DOCX, 10 Mo maximum. Jobalso détectera
                  automatiquement vos compétences et langues.
                </p>
              </>
            )}

            {erreurUpload && (
              <p
                className="text-sm rounded-xl px-4 py-3 mt-4 text-left max-w-xl mx-auto"
                style={{
                  color: "#B4232C",
                  background: "#FDEDEE",
                  border: "1px solid #F6C6C9",
                }}
              >
                {erreurUpload}
              </p>
            )}
          </div>

          {/* =================================================
              FORMULAIRE
          ================================================= */}

          <form onSubmit={handleSubmit}>
            <div
              className="bg-white rounded-2xl p-5 md:p-7"
              style={{
                border: "1px solid #DDE8F0",
                boxShadow: "0 8px 25px rgba(6,20,32,0.05)",
              }}
            >
              {/* Résumé */}

              <div className="mb-5">
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#123B60" }}
                >
                  Résumé
                </label>

                <textarea
                  value={resumeCv}
                  onChange={(e) => setResumeCv(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
                  style={{
                    border: "1px solid #D6E3ED",
                    color: "#10202E",
                    background: "#FFFFFF",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#1682D4";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(22,130,212,0.10)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D6E3ED";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder="Décrivez votre profil en quelques lignes, ou déposez votre CV ci-dessus"
                />
              </div>

              {/* Localisation / Poste */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <Champ
                  label="Localisation"
                  value={localisation}
                  onChange={setLocalisation}
                  placeholder="Dakar, Sénégal"
                />

                <Champ
                  label="Type de poste recherché"
                  value={typePosteRecherche}
                  onChange={setTypePosteRecherche}
                  placeholder="Développeur Backend"
                />
              </div>

              {/* Compétences */}

              <div className="mb-5">
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#123B60" }}
                >
                  Compétences{" "}
                  <span
                    className="font-normal"
                    style={{ color: "#94A9B8" }}
                  >
                    (détectées automatiquement, éditables)
                  </span>
                </label>

                <Etiquettes
                  valeurs={competences}
                  onChange={setCompetences}
                  placeholder="Ajouter une compétence, puis Entrée"
                />
              </div>

              {/* Langues */}

              <div className="mb-5">
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#123B60" }}
                >
                  Langues{" "}
                  <span
                    className="font-normal"
                    style={{ color: "#94A9B8" }}
                  >
                    (détectées automatiquement, éditables)
                  </span>
                </label>

                <Etiquettes
                  valeurs={langues}
                  onChange={setLangues}
                  placeholder="Ajouter une langue, puis Entrée"
                />
              </div>

              {/* Expérience */}

              <div className="mb-5">
                <Champ
                  label="Expérience (séparée par des virgules)"
                  value={experience}
                  onChange={setExperience}
                  placeholder="Développeur chez X (2020-2023), Stage chez Y (2019)"
                />
              </div>

              {/* Formation / Domaine */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <Champ
                  label="Formation (virgules)"
                  value={education}
                  onChange={setEducation}
                  placeholder="Licence Informatique - UGB"
                />

                <Champ
                  label="Domaine d'étude (virgules)"
                  value={domaineEtude}
                  onChange={setDomaineEtude}
                  placeholder="Génie Informatique"
                />
              </div>

              {/* Certifications */}

              <div className="mb-6">
                <Champ
                  label="Certifications (séparées par des virgules)"
                  value={certifications}
                  onChange={setCertifications}
                  placeholder="AWS Certified, Scrum Master"
                />
              </div>

              {/* Messages */}

              {erreur && (
                <div
                  className="text-sm rounded-xl px-4 py-3 mb-4"
                  style={{
                    color: "#B4232C",
                    background: "#FDEDEE",
                    border: "1px solid #F6C6C9",
                  }}
                >
                  {erreur}
                </div>
              )}

              {succes && (
                <div
                  className="text-sm rounded-xl px-4 py-3 mb-4"
                  style={{
                    color: "#0F7A5C",
                    background: "#E9F8F2",
                    border: "1px solid #BEEBDA",
                  }}
                >
                  CV enregistré avec succès
                </div>
              )}

              {/* Bouton */}

              <button
                type="submit"
                disabled={enregistrement}
                className="w-full text-white rounded-xl py-3 text-sm font-bold transition-all disabled:opacity-50 hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg,#08477F,#0D64A8,#1685D4)",
                }}
              >
                {enregistrement
                  ? "Enregistrement..."
                  : cv
                    ? "Mettre à jour"
                    : "Créer mon CV"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}