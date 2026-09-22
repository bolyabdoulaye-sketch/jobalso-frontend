"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api-client";
import { logout } from "@/lib/auth";
import type { Offre } from "@/types";

export default function OffresPage() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Offre[]>("/api/v1/offres/")
      .then(setOffres)
      .catch(() => setErreur("Impossible de charger les offres"))
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mes offres</h1>
            <p className="text-sm text-gray-500">Espace recruteur</p>
          </div>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900">
            Déconnexion
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <Link
            href="/offres/nouvelle"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
          >
            + Nouvelle offre
          </Link>
        </div>

        {erreur && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {erreur}
          </p>
        )}

        {offres.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">Aucune offre pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offres.map((offre) => (
              <Link
                key={offre.id_offre}
                href={`/offres/${offre.id_offre}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-400 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{offre.titre_offre}</h3>
                    <p className="text-sm text-gray-500">{offre.type_contrat || "—"}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      offre.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {offre.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}