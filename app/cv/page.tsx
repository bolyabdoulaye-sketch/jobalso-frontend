"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError, API_URL, getToken } from "@/lib/api-client";
import { logout } from "@/lib/auth";
import type { CV, CVPayload } from "@/types";

function uploaderCv(fichier: File, onProgress: (pct: number) => void): Promise<CV> {
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
          reject(new Error("Reponse invalide du serveur"));
        }
      } else {
        let detail = "Echec de l'upload";
        try {
          const body = JSON.parse(xhr.responseText);
          detail = body.detail || detail;
        } catch {
          // garde le message par defaut
        }
        reject(new Error(detail));
      }
    };
    xhr.onerror = () => reject(new Error("Erreur de connexion au serveur"));

    const formData = new FormData();
    formData.append("fichier", fichier);
    xhr.send(formData);
  });
}

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
    const v = saisie.trim();
    if (v && !valeurs.includes(v)) {
      onChange([...valeurs, v]);
    }
    setSaisie("");
  }

  function retirer(v: string) {
    onChange(valeurs.filter((x) => x !== v));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {valeurs.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "#D0EFFF", color: "#0D5298" }}
          >
            {v}
            <button
              type="button"
              onClick={() => retirer(v)}
              className="hover:opacity-70"
              aria-label={`Retirer ${v}`}
            >
              ×
            </button>
          </span>
        ))}
        {valeurs.length === 0 && (
          <span className="text-xs" style={{ color: "#94A9B8" }}>
            Rien détecté pour l&apos;instant
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
        onBlur={ajouter}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
        style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
        placeholder={placeholder}
      />
    </div>
  );
}

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
    setCompetences(Array.isArray(data.competences) ? (data.competences as string[]) : []);
    setLangues(Array.isArray(data.langues) ? (data.langues as string[]) : []);
    setLocalisation(data.localisation || "");
    setTypePosteRecherche(data.type_poste_recherche || "");
    setExperience(Array.isArray(data.experience) ? (data.experience as string[]).join(", ") : "");
    setEducation(Array.isArray(data.education) ? (data.education as string[]).join(", ") : "");
    setDomaineEtude(Array.isArray(data.domaine_etude) ? (data.domaine_etude as string[]).join(", ") : "");
    setCertifications(Array.isArray(data.certifications) ? (data.certifications as string[]).join(", ") : "");
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
    return valeur.split(",").map((v) => v.trim()).filter(Boolean);
  }

  async function traiterFichier(fichier: File) {
    setErreurUpload(null);

    const extension = fichier.name.toLowerCase().slice(fichier.name.lastIndexOf("."));
    if (![".pdf", ".docx"].includes(extension)) {
      setErreurUpload("Seuls les fichiers PDF et DOCX sont acceptés");
      return;
    }
    if (fichier.size > 10 * 1024 * 1024) {
      setErreurUpload("Le fichier dépasse la taille maximale de 10 Mo");
      return;
    }

    setUploadEnCours(true);
    setProgression(0);

    try {
      const resultat = await uploaderCv(fichier, setProgression);
      appliquerCv(resultat);
      setSucces(true);
    } catch (err) {
      setErreurUpload(err instanceof Error ? err.message : "Échec de l'upload");
    } finally {
      setUploadEnCours(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setGlisser(false);
    const fichier = e.dataTransfer.files?.[0];
    if (fichier) traiterFichier(fichier);
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
      type_poste_recherche: typePosteRecherche || undefined,
      experience: toListe(experience),
      education: toListe(education),
      domaine_etude: toListe(domaineEtude),
      certifications: toListe(certifications),
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
          <div className="flex items-center gap-5">
            <Link href="/candidatures" className="text-sm font-semibold" style={{ color: "#187ACD" }}>
              Mes candidatures
            </Link>
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
        </div>

        {cv && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: "1px solid #DCE7F0", boxShadow: "0 8px 20px rgba(6,20,32,0.06)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#587B95" }}>
                Code CV à partager aux recruteurs
              </p>
              <p className="text-2xl font-mono font-extrabold mt-1" style={{ color: "#187ACD" }}>
                {cv.code_cv}
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: "1px solid #DCE7F0", boxShadow: "0 8px 20px rgba(6,20,32,0.06)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#587B95" }}>
                Complétude du profil
              </p>
              <p className="text-2xl font-extrabold mt-1" style={{ color: "#10202E" }}>
                {cv.taux_completude}%
              </p>
              <div className="w-full h-2 rounded-full mt-2" style={{ background: "#EEF3F7" }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${cv.taux_completude}%`, background: "#187ACD" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Zone de depot du CV (JA-030, JA-031) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setGlisser(true);
          }}
          onDragLeave={() => setGlisser(false)}
          onDrop={handleDrop}
          onClick={() => inputFichierRef.current?.click()}
          className="bg-white rounded-2xl p-8 mb-6 text-center cursor-pointer transition-colors"
          style={{
            border: `2px dashed ${glisser ? "#187ACD" : "#DCE7F0"}`,
            background: glisser ? "#F7FAFD" : "#fff",
          }}
        >
          <input
            ref={inputFichierRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => {
              const fichier = e.target.files?.[0];
              if (fichier) traiterFichier(fichier);
              e.target.value = "";
            }}
          />

          {uploadEnCours ? (
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "#10202E" }}>
                Analyse du CV en cours... {progression}%
              </p>
              <div className="w-full h-2 rounded-full mx-auto max-w-xs" style={{ background: "#EEF3F7" }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${progression}%`, background: "#187ACD" }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm font-bold" style={{ color: "#10202E" }}>
                Glissez votre CV ici ou cliquez pour parcourir
              </p>
              <p className="text-xs mt-1" style={{ color: "#94A9B8" }}>
                PDF ou DOCX, 10 Mo maximum. Jobalso détectera automatiquement vos compétences et langues.
              </p>
            </div>
          )}

          {erreurUpload && (
            <p
              className="text-sm rounded-lg px-3 py-2 mt-4 text-left"
              style={{ color: "#B4232C", background: "#FDEDEE", border: "1px solid #F6C6C9" }}
            >
              {erreurUpload}
            </p>
          )}
        </div>

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
              placeholder="Décrivez votre profil en quelques lignes, ou déposez votre CV ci-dessus"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
                Localisation
              </label>
              <input
                type="text"
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
                placeholder="Dakar, Sénégal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
                Type de poste recherché
              </label>
              <input
                type="text"
                value={typePosteRecherche}
                onChange={(e) => setTypePosteRecherche(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
                placeholder="Développeur Backend"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Compétences <span className="font-normal" style={{ color: "#94A9B8" }}>(détectées automatiquement, éditables)</span>
            </label>
            <Etiquettes valeurs={competences} onChange={setCompetences} placeholder="Ajouter une compétence, puis Entrée" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Langues <span className="font-normal" style={{ color: "#94A9B8" }}>(détectées automatiquement, éditables)</span>
            </label>
            <Etiquettes valeurs={langues} onChange={setLangues} placeholder="Ajouter une langue, puis Entrée" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Expérience <span className="font-normal" style={{ color: "#94A9B8" }}>(séparée par des virgules)</span>
            </label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
              placeholder="Développeur chez X (2020-2023), Stage chez Y (2019)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
                Formation <span className="font-normal" style={{ color: "#94A9B8" }}>(virgules)</span>
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
                placeholder="Licence Informatique - UGB"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
                Domaine d&apos;étude <span className="font-normal" style={{ color: "#94A9B8" }}>(virgules)</span>
              </label>
              <input
                type="text"
                value={domaineEtude}
                onChange={(e) => setDomaineEtude(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
                placeholder="Génie Informatique"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#10202E" }}>
              Certifications <span className="font-normal" style={{ color: "#94A9B8" }}>(séparées par des virgules)</span>
            </label>
            <input
              type="text"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ border: "1.5px solid #DCE7F0", color: "#10202E" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#187ACD")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#DCE7F0")}
              placeholder="AWS Certified, Scrum Master"
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
