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

export function logout() {
  clearToken();
  window.location.href = "/connexion";
}

export { setToken };