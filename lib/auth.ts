"use client";

import { useEffect, useState } from "react";
import { apiFetch, setToken, clearToken } from "./api-client";
import type { Utilisateur } from "@/types";

export function useCurrentUser() {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Utilisateur>("/api/v1/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

export function logout(role?: "CANDIDAT" | "RECRUTEUR") {
  clearToken();
  const query =
    role === "RECRUTEUR" ? "?role=recruteur" : role === "CANDIDAT" ? "?role=candidat" : "";
  window.location.href = `/connexion${query}`;
}

export { setToken };
