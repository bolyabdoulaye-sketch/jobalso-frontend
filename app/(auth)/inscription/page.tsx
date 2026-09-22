"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { InscriptionPayload, TypeUtilisateur } from "@/types";

export default function InscriptionPage() {
  const router = useRouter();
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-green-700 font-medium">Compte créé avec succès !</p>
        <p className="text-sm text-gray-500 mt-1">Redirection vers la connexion...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Créer un compte</h2>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTypeUtilisateur("CANDIDAT")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium border transition ${
            typeUtilisateur === "CANDIDAT"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          Candidat
        </button>
        <button
          type="button"
          onClick={() => setTypeUtilisateur("RECRUTEUR")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium border transition ${
            typeUtilisateur === "RECRUTEUR"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          Recruteur
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input
            type="text"
            required
            value={nomPrenom}
            onChange={(e) => setNomPrenom(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            required
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="+221 77 123 45 67"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            required
            minLength={8}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {typeUtilisateur === "RECRUTEUR" && (
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 pt-2">Informations entreprise</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;entreprise</label>
              <input
                type="text"
                required
                value={nomEntreprise}
                onChange={(e) => setNomEntreprise(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <input
                type="text"
                required
                value={paysEntreprise}
                onChange={(e) => setPaysEntreprise(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation (optionnel)</label>
              <input
                type="text"
                value={localisationEntreprise}
                onChange={(e) => setLocalisationEntreprise(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {chargement ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        Déjà un compte ?{" "}
        <a href="/connexion" className="text-gray-900 font-medium hover:underline">
          Connectez-vous
        </a>
      </p>
    </div>
  );
}