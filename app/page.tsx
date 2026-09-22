"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, logout } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/connexion");
      return;
    }

    if (user.type_utilisateur === "CANDIDAT") {
      router.push("/cv");
    } else {
      router.push("/offres");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">Chargement...</p>
    </div>
  );
}